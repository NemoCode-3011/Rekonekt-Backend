import { createHash, randomBytes } from "node:crypto";
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
} from "../model/auth.queries";
import { sendAdminSetupEmail, sendOtpEmail } from "../utils/email";
import { otpGenerator } from "@utils/otpGenerator";
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

export class AuthServiceError extends Error {
  constructor(
    readonly code: string,
    message: string,
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
const checkOtp = async (purpose: OtpPurpose, email: string, otp: string) => {
  const digest = createHash("sha256").update(otp).digest("hex");
  const result = await redisClient.eval(
    `
      local attempts = redis.call("INCR", KEYS[2])
      if attempts == 1 then
        redis.call("EXPIRE", KEYS[2], tonumber(ARGV[2]))
      end
      if attempts > tonumber(ARGV[1]) then
        redis.call("DEL", KEYS[1])
        return 0
      end
      local stored = redis.call("GET", KEYS[1])
      if stored and stored == ARGV[3] then
        redis.call("DEL", KEYS[1], KEYS[2])
        return 1
      end
      return 0
    `,
    {
      keys: [codeKey(purpose, email), attemptsKey(purpose, email)],
      arguments: [
        String(MAX_OTP_ATTEMPTS),
        String(OTP_TTL_SECONDS),
        digest,
      ],
    },
  );
  return result === 1;
};

const clearOtp = async (purpose: OtpPurpose, email: string) => {
  await redisClient.del([codeKey(purpose, email), attemptsKey(purpose, email)]);
};

const claimOtpCooldown = async (purpose: OtpPurpose, email: string) => {
  const result = await redisClient.set(cooldownKey(purpose, email), "1", {
    NX: true,
    EX: OTP_COOLDOWN_SECONDS,
  });

  return result === "OK";
};

const issueOtp = async (purpose: OtpPurpose, email: string) => {
  if (!(await claimOtpCooldown(purpose, email))) return false;

  try {
    const otp = otpGenerator();
    await storeOtp(purpose, email, otp);
    await sendOtpEmail(email, otp, purpose);
    return true;
  } catch (error) {
    await clearOtp(purpose, email);
    await redisClient.del(cooldownKey(purpose, email));
    throw error;
  }
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

  if (found?.is_verified) {
    throw new AuthServiceError("EMAIL_ALREADY_EXISTS", "Email already exists");
  }

  let user = found;
  if (!user) {
    const hashedPassword = await hashPassword(data.password);
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

      // Another signup may have created the account after the first lookup.
      user = (await pool.query(getUserByEmail, [email])).rows[0];
      if (!user || user.is_verified) {
        throw new AuthServiceError(
          "EMAIL_ALREADY_EXISTS",
          "Email already exists",
        );
      }
    }
  }

  if (!user) {
    throw new Error("Unable to create user");
  }

  // Re-registering an unverified email must not replace the original
  // credentials; only the person who controls the mailbox can verify it.
  await issueOtp("verification", email);

  return { id: user.id, email: user.email };
};

export const verifyOtpService = async (data: {
  email: string;
  otp: string;
}) => {
  const email = cleanEmail(data.email);

  if (!(await checkOtp("verification", email, data.otp))) {
    throw new AuthServiceError("INVALID_OTP", "Invalid or expired OTP");
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
    const emailExists = await client.query(getUserByEmail, [email]);

    if (emailExists.rows.length > 0) {
      throw new Error("Email already exists");
    }

    const initialPassword = randomBytes(32).toString("hex");
    const hashedPassword = await hashPassword(initialPassword);

    const result = await client.query(createAdminQuery, [
      data.name.trim(),
      email,
      hashedPassword,
      data.preferredLanguage ?? "en",
    ]);

    const setupToken = randomBytes(32).toString("base64url");
    const tokenDigest = createHash("sha256").update(setupToken).digest("hex");
    setupTokenKey = `admin-setup:${tokenDigest}`;
    await redisClient.set(setupTokenKey, String(result.rows[0].id), {
      EX: 60 * 60,
    });

    const clientUrl = (
      process.env.CLIENT_URL ?? "http://localhost:5173"
    ).replace(/\/+$/, "");
    await sendAdminSetupEmail(
      result.rows[0].name,
      result.rows[0].email,
      `${clientUrl}/admin/setup-password?token=${encodeURIComponent(setupToken)}`,
    );
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

  // Same answer whether or not the account exists, so this endpoint can't be
  // used to find out which emails are registered.
  if (user && !user.is_verified) {
    if (!(await issueOtp("verification", email))) {
      throw new AuthServiceError("OTP_COOLDOWN", OTP_COOLDOWN_MESSAGE);
    }
  } else {
    // Apply the same cooldown regardless of account state to avoid using
    // response timing to enumerate addresses.
    await claimOtpCooldown("verification", email);
  }

  return { email };
};

export const forgotPasswordService = async (rawEmail: string) => {
  const email = cleanEmail(rawEmail);
  const result = await pool.query(getUserByEmail, [email]);

  const user = result.rows[0];

  // Same answer whether or not the account exists (see resendOtpService).
  if (user) {
    await issueOtp("password-reset", email);
  } else {
    await claimOtpCooldown("password-reset", email);
  }

  return { email };
};

export const resetPasswordService = async (
  rawEmail: string,
  otp: string,
  newPassword: string,
) => {
  const email = cleanEmail(rawEmail);
  if (!(await checkOtp("password-reset", email, otp))) {
    throw new AuthServiceError("INVALID_OTP", "Invalid or expired OTP");
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

  const matches = await comparePassword(currentPassword, result.rows[0].password);

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
