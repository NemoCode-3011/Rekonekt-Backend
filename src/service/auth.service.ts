import { createHash, randomBytes } from "node:crypto";
import { getClientUrl } from "../config/clientOrigin";
import { pool } from "../database/db";
import { redisClient } from "../config/redis";
import {
  createAdminQuery,
  createUserQuery,
  getUserByEmail,
  getUserById,
  getUserForResendOtpQuery,
  updateUserPasswordQuery,
  updateUserVerifiedQuery,
  updateUserProfileQuery,
  getUserPasswordByIdQuery,
  updateUserPasswordByIdQuery,
  getAdminsQuery,
  revokeAdminQuery,
  setupAdminPasswordQuery,
  promoteUserToAdminQuery,
} from "../model/auth.queries";
import { sendAdminSetupEmail, sendOtpEmail } from "../utils/email";
import { otpGenerator } from "../utils/otpGenerator";
import { createSession, deleteUserSessions } from "../utils/sessions";
import { comparePassword, hashPassword } from "../utils/password";

const OTP_TTL_SECONDS = 300;
const MAX_OTP_ATTEMPTS = 5;
const OTP_COOLDOWN_SECONDS = 60;
export const OTP_COOLDOWN_MESSAGE =
  "Please wait a minute before asking for another code";
// One place that decides what "the same email" means.
const cleanEmail = (email: string) => email.trim().toLowerCase();

type OtpPurpose = "verification" | "password-reset";

interface OtpIssueResult {
  sent: boolean;
  cooldownActive: boolean;
  retryAfterSeconds: number;
  expiresInSeconds?: number;
  otpMayAlreadyBeAvailable?: boolean;
}

export class AuthServiceError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly details: Record<string, unknown> | null = null,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

const emailKey = (purpose: OtpPurpose, email: string) =>
  `${purpose}:${createHash("sha256").update(email).digest("hex")}`;
const codeKey = (purpose: OtpPurpose, email: string) =>
  `auth-otp:${emailKey(purpose, email)}`;
const attemptsKey = (purpose: OtpPurpose, email: string) =>
  `auth-otp-attempts:${emailKey(purpose, email)}`;
const cooldownKey = (purpose: OtpPurpose, email: string) =>
  `auth-otp-cooldown:${emailKey(purpose, email)}`;

// Saves a fresh code. A new code also starts a fresh set of tries.
const storeOtp = async (purpose: OtpPurpose, email: string, otp: string) => {
  const digest = createHash("sha256").update(otp).digest("hex");
  await redisClient.set(codeKey(purpose, email), digest, {
    EX: OTP_TTL_SECONDS,
  });
  await redisClient.del(attemptsKey(purpose, email));
};

// Validation and consumption happen together so concurrent requests cannot
// both accept the same code.
type OtpCheckResult =
  | { status: "valid" }
  | { status: "expired" }
  | { status: "incorrect"; attemptsRemaining: number }
  | { status: "attempts-exceeded" };

const checkOtp = async (
  purpose: OtpPurpose,
  email: string,
  otp: string,
): Promise<OtpCheckResult> => {
  const digest = createHash("sha256").update(otp).digest("hex");
  const result = await redisClient.eval(
    `
      local stored = redis.call("GET", KEYS[1])
      if not stored then
        return {-1, 0}
      end
      local attempts = redis.call("INCR", KEYS[2])
      if attempts == 1 then
        redis.call("EXPIRE", KEYS[2], tonumber(ARGV[2]))
      end
      if attempts > tonumber(ARGV[1]) then
        redis.call("DEL", KEYS[1], KEYS[2])
        return {-2, 0}
      end
      if stored and stored == ARGV[3] then
        redis.call("DEL", KEYS[1], KEYS[2])
        return {1, 0}
      end
      return {0, tonumber(ARGV[1]) - attempts}
    `,
    {
      keys: [codeKey(purpose, email), attemptsKey(purpose, email)],
      arguments: [String(MAX_OTP_ATTEMPTS), String(OTP_TTL_SECONDS), digest],
    },
  );
  if (!Array.isArray(result) || result.length !== 2) {
    throw new Error("Unexpected OTP validation response");
  }

  const [status, attemptsRemaining] = result.map(Number);
  if (status === 1) return { status: "valid" };
  if (status === -1) return { status: "expired" };
  if (status === -2) return { status: "attempts-exceeded" };
  return { status: "incorrect", attemptsRemaining };
};

const clearOtp = async (purpose: OtpPurpose, email: string) => {
  await redisClient.del([codeKey(purpose, email), attemptsKey(purpose, email)]);
};

const claimOtpCooldown = async (purpose: OtpPurpose, email: string) => {
  const key = cooldownKey(purpose, email);
  const result = await redisClient.set(key, "1", {
    NX: true,
    EX: OTP_COOLDOWN_SECONDS,
  });

  if (result === "OK") {
    return {
      claimed: true,
      retryAfterSeconds: OTP_COOLDOWN_SECONDS,
    };
  }

  const ttl = await redisClient.ttl(key);
  return {
    claimed: false,
    retryAfterSeconds: ttl > 0 ? ttl : 1,
  };
};

const issueOtp = async (
  purpose: OtpPurpose,
  email: string,
): Promise<OtpIssueResult> => {
  const cooldown = await claimOtpCooldown(purpose, email);
  if (!cooldown.claimed) {
    const otpTtl = await redisClient.ttl(codeKey(purpose, email));
    return {
      sent: false,
      cooldownActive: true,
      retryAfterSeconds: cooldown.retryAfterSeconds,
      otpMayAlreadyBeAvailable: otpTtl > 0,
    };
  }

  let otp: string;
  try {
    otp = otpGenerator();
    await storeOtp(purpose, email, otp);
  } catch (error) {
    await clearOtp(purpose, email);
    await redisClient.del(cooldownKey(purpose, email));
    throw error;
  }

  try {
    await sendOtpEmail(email, otp, purpose);
  } catch {
    await clearOtp(purpose, email);
    await redisClient.del(cooldownKey(purpose, email));
    throw new AuthServiceError(
      "OTP_DELIVERY_FAILED",
      "Unable to deliver the verification code",
      { otpSent: false, nextStep: "resend-otp" },
    );
  }

  return {
    sent: true,
    cooldownActive: true,
    retryAfterSeconds: OTP_COOLDOWN_SECONDS,
    expiresInSeconds: OTP_TTL_SECONDS,
  };
};

const existingEmailError = (user: { is_verified: boolean }) => {
  const accountVerified = Boolean(user.is_verified);
  return new AuthServiceError(
    accountVerified ? "EMAIL_ALREADY_EXISTS" : "EMAIL_REQUIRES_VERIFICATION",
    accountVerified
      ? "Email already exists"
      : "This email already has an account awaiting verification",
    {
      accountVerified,
      requiresVerification: !accountVerified,
      canRequestOtp: !accountVerified,
      otpSent: false,
      otpAlreadySent: null,
      nextStep: accountVerified ? "sign-in" : "resend-otp",
    },
  );
};

interface SignUpInput {
  name: string;
  email: string;
  password: string;
  preferredLanguage?: string;
}

export const signUpService = async (data: SignUpInput) => {
  const email = cleanEmail(data.email);
  const name = data.name.trim();
  const language = data.preferredLanguage ?? "en";
  const found = (await pool.query(getUserByEmail, [email])).rows[0];

  if (found) {
    throw existingEmailError(found);
  }

  const hashedPassword = await hashPassword(data.password);
  let user;
  try {
    const result = await pool.query(createUserQuery, [
      name,
      email,
      hashedPassword,
      language,
    ]);
    user = result.rows[0];
  } catch (error: any) {
    if (error?.code !== "23505") throw error;

    // Another signup may have created this account after the initial lookup.
    const racedUser = (await pool.query(getUserByEmail, [email])).rows[0];
    if (!racedUser) throw error;
    throw existingEmailError(racedUser);
  }

  if (!user) {
    throw new Error("Unable to create user");
  }

  const otp = await issueOtp("verification", email);
  if (!otp.sent) {
    throw new AuthServiceError("OTP_COOLDOWN", OTP_COOLDOWN_MESSAGE, {
      accountCreated: true,
      requiresVerification: true,
      otpSent: false,
      otpMayAlreadyBeAvailable: otp.otpMayAlreadyBeAvailable,
      cooldownActive: true,
      retryAfterSeconds: otp.retryAfterSeconds,
      nextStep: "check-email",
    });
  }

  return {
    id: user.id,
    email: user.email,
    otpSent: true,
    requiresVerification: true,
    expiresInSeconds: otp.expiresInSeconds,
    resendAfterSeconds: otp.retryAfterSeconds,
    nextStep: "verify-otp",
  };
};

export const verifyOtpService = async (data: {
  email: string;
  otp: string;
}) => {
  const email = cleanEmail(data.email);

  const otpResult = await checkOtp("verification", email, data.otp);
  if (otpResult.status === "expired") {
    throw new AuthServiceError(
      "OTP_EXPIRED",
      "The code expired or was not found",
      {
        otpExpired: true,
        requiresVerification: true,
        canRequestOtp: true,
        nextStep: "resend-otp",
      },
    );
  }
  if (otpResult.status === "attempts-exceeded") {
    throw new AuthServiceError(
      "OTP_ATTEMPTS_EXCEEDED",
      "Too many incorrect codes. Request a new code to continue.",
      {
        otpExpired: false,
        attemptsRemaining: 0,
        requiresVerification: true,
        canRequestOtp: true,
        nextStep: "resend-otp",
      },
    );
  }
  if (otpResult.status === "incorrect") {
    throw new AuthServiceError("INVALID_OTP", "The code is incorrect", {
      otpExpired: false,
      attemptsRemaining: otpResult.attemptsRemaining,
      requiresVerification: true,
    });
  }

  const result = await pool.query(updateUserVerifiedQuery, [email]);

  if (result.rows.length === 0) {
    throw new AuthServiceError("USER_NOT_FOUND", "User not found");
  }

  const user = result.rows[0];
  await clearOtp("verification", email);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    cultural_group_id: user.cultural_group_id,
    preferred_language: user.preferred_language,
    is_verified: user.is_verified,
  };
};

export const signInService = async (data: {
  email: string;
  password: string;
}) => {
  const email = cleanEmail(data.email);
  const result = await pool.query(getUserByEmail, [email]);

  if (result.rows.length === 0) {
    throw new AuthServiceError("INVALID_CREDENTIALS", "Invalid credentials");
  }
  const user = result.rows[0];

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new AuthServiceError("INVALID_CREDENTIALS", "Invalid credentials");
  }

  if (!user.is_verified) {
    throw new AuthServiceError(
      "EMAIL_NOT_VERIFIED",
      "Please verify your email first",
      { requiresVerification: true, nextStep: "resend-otp" },
    );
  }

  const sessionId = await createSession(user.id);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    cultural_group_id: user.cultural_group_id,
    preferred_language: user.preferred_language,
    is_verified: user.is_verified,
    sessionId,
  };
};

export const getCurrentUserService = async (userId: number) => {
  const result = await pool.query(getUserById, [userId]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

export const logoutService = async (sessionId: string) => {
  await redisClient.del(`session:${sessionId}`);
};

export const createAdminService = async (data: {
  name: string;
  email: string;
  preferredLanguage?: string;
}) => {
  const client = await pool.connect();
  let setupTokenKey: string | undefined;
  let transactionStarted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    const email = data.email.trim().toLowerCase();
    const existing = await client.query(getUserByEmail, [email]);
    const existingUser = existing.rows[0];

    // Already an admin or super admin: nothing to do.
    if (existingUser && existingUser.role !== "visitor") {
      throw new Error("User is already an admin");
    }

    let result;

    if (existingUser) {
      // They already signed up, so keep the account and just change the role.
      result = await client.query(promoteUserToAdminQuery, [
        existingUser.id,
        data.name.trim(),
      ]);

      // Role changed between the lookup and the update.
      if (!result.rows[0]) {
        throw new Error("User is already an admin");
      }
    } else {
      const initialPassword = randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(initialPassword);

      result = await client.query(createAdminQuery, [
        data.name.trim(),
        email,
        hashedPassword,
        data.preferredLanguage ?? "en",
      ]);
    }

    const setupToken = randomBytes(32).toString("base64url");
    const tokenDigest = createHash("sha256").update(setupToken).digest("hex");
    setupTokenKey = `admin-setup:${tokenDigest}`;
    await redisClient.set(setupTokenKey, String(result.rows[0].id), {
      EX: 60 * 60,
    });

    const clientUrl = getClientUrl();
    try {
      await sendAdminSetupEmail(
        result.rows[0].name,
        result.rows[0].email,
        `${clientUrl}/admin/setup-password?token=${encodeURIComponent(setupToken)}`,
      );
    } catch (emailError: any) {
      console.error("Admin invite email failed:", emailError?.message);
      throw new Error("EMAIL_SEND_FAILED");
    }
    await client.query("COMMIT");
    transactionStarted = false;

    return result.rows[0];
  } catch (error: any) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }

    if (setupTokenKey) {
      await redisClient.del(setupTokenKey);
    }

    if (error?.code === "23505") {
      throw new Error("Email already exists");
    }

    throw error;
  } finally {
    client.release();
  }
};

export const setupAdminPasswordService = async (
  token: string,
  password: string,
) => {
  const tokenDigest = createHash("sha256").update(token).digest("hex");
  const userId = await redisClient.getDel(`admin-setup:${tokenDigest}`);

  if (!userId) {
    throw new Error("Invalid or expired setup link");
  }

  const hashedPassword = await hashPassword(password);
  const result = await pool.query(setupAdminPasswordQuery, [
    hashedPassword,
    Number(userId),
  ]);

  if (!result.rows[0]) {
    throw new Error("Invalid or expired setup link");
  }

  return result.rows[0];
};

export const resendOtpService = async (rawEmail: string) => {
  const email = cleanEmail(rawEmail);
  const result = await pool.query(getUserForResendOtpQuery, [email]);

  const user = result.rows[0];

  let cooldown: OtpIssueResult;
  if (user && !user.is_verified) {
    cooldown = await issueOtp("verification", email);
  } else {
    const result = await claimOtpCooldown("verification", email);
    cooldown = {
      sent: false,
      cooldownActive: !result.claimed,
      retryAfterSeconds: result.retryAfterSeconds,
      otpMayAlreadyBeAvailable: false,
    };
  }

  if (cooldown.cooldownActive && !cooldown.sent) {
    throw new AuthServiceError("OTP_COOLDOWN", OTP_COOLDOWN_MESSAGE, {
      requestAccepted: true,
      otpSent: null,
      otpAlreadySent: null,
      cooldownActive: true,
      retryAfterSeconds: cooldown.retryAfterSeconds,
      nextStep: "check-email",
    });
  }

  return {
    requestAccepted: true,
    otpSent: null,
    otpAlreadySent: null,
    cooldownActive: false,
    nextStep: "check-email",
    resendAfterSeconds: OTP_COOLDOWN_SECONDS,
  };
};

export const forgotPasswordService = async (rawEmail: string) => {
  const email = cleanEmail(rawEmail);
  const result = await pool.query(getUserByEmail, [email]);

  const user = result.rows[0];

  try {
    if (user) {
      await issueOtp("password-reset", email);
    } else {
      await claimOtpCooldown("password-reset", email);
    }
  } catch (error) {
    if (
      !(error instanceof AuthServiceError) ||
      error.code !== "OTP_DELIVERY_FAILED"
    ) {
      throw error;
    }

    console.error("Password reset email delivery failed");
  }

  return {
    requestAccepted: true,
    otpSent: null,
    cooldownActive: null,
    nextStep: "check-email",
  };
};

export const resetPasswordService = async (
  rawEmail: string,
  otp: string,
  newPassword: string,
) => {
  const email = cleanEmail(rawEmail);
  const otpResult = await checkOtp("password-reset", email, otp);
  if (otpResult.status === "expired") {
    throw new AuthServiceError(
      "OTP_EXPIRED",
      "The code expired or was not found",
      {
        otpExpired: true,
        canRequestOtp: true,
        nextStep: "forgot-password",
      },
    );
  }
  if (otpResult.status === "attempts-exceeded") {
    throw new AuthServiceError(
      "OTP_ATTEMPTS_EXCEEDED",
      "Too many incorrect codes. Request a new code to continue.",
      {
        otpExpired: false,
        attemptsRemaining: 0,
        canRequestOtp: true,
        nextStep: "forgot-password",
      },
    );
  }
  if (otpResult.status === "incorrect") {
    throw new AuthServiceError("INVALID_OTP", "The code is incorrect", {
      otpExpired: false,
      attemptsRemaining: otpResult.attemptsRemaining,
    });
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await pool.query(updateUserPasswordQuery, [
    hashedPassword,
    email,
  ]);

  if (!result.rows[0]) {
    throw new AuthServiceError("USER_NOT_FOUND", "User not found");
  }

  await clearOtp("password-reset", email);

  await deleteUserSessions(result.rows[0].id);

  return result.rows[0];
};

export const updateProfileService = async (
  userId: number,
  data: {
    name: string;
    preferredLanguage: string;
    culturalGroupId: number | null;
  },
) => {
  try {
    const result = await pool.query(updateUserProfileQuery, [
      data.name,
      data.preferredLanguage,
      data.culturalGroupId,
      userId,
    ]);

    if (!result.rows[0]) {
      throw new Error("User not found");
    }

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23503") {
      throw new Error("Cultural group not found");
    }

    throw error;
  }
};

export const changePasswordService = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
  currentSessionId?: string,
) => {
  const result = await pool.query(getUserPasswordByIdQuery, [userId]);

  if (!result.rows[0]) {
    throw new AuthServiceError("USER_NOT_FOUND", "User not found");
  }

  const matches = await comparePassword(
    currentPassword,
    result.rows[0].password,
  );

  if (!matches) {
    throw new AuthServiceError(
      "CURRENT_PASSWORD_INCORRECT",
      "Current password is incorrect",
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  const updated = await pool.query(updateUserPasswordByIdQuery, [
    hashedPassword,
    userId,
  ]);
  if (!updated.rows[0]) {
    throw new AuthServiceError("USER_NOT_FOUND", "User not found");
  }

  await deleteUserSessions(userId, currentSessionId);
};

export const getAdminsService = async () => {
  const result = await pool.query(getAdminsQuery);
  return result.rows;
};

export const revokeAdminService = async (id: number, requesterId: number) => {
  if (id === requesterId) {
    throw new Error("You can't remove your own access");
  }

  const result = await pool.query(revokeAdminQuery, [id]);

  if (!result.rows[0]) {
    throw new Error("Admin not found");
  }
  // Sign admins out everywhere, so an open session wont stick
  await deleteUserSessions(id);

  return result.rows[0];
};
