import bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";
import { pool } from "../database/db";
import { redisClient } from "../config/redis";
import {
  createAdminQuery,
  createUserQuery,
  getUserByEmail,
  getUserById,
  updateUserPasswordQuery,
  updateUserVerifiedQuery,
  updateUserProfileQuery,
  getUserPasswordByIdQuery,
  updateUserPasswordByIdQuery,
  getAdminsQuery,
  revokeAdminQuery,
  setupAdminPasswordQuery,
  takeOverUnverifiedUserQuery,
} from "../model/auth.queries";
import { sendAdminSetupEmail, sendOtpEmail } from "../utils/email";
import { otpGenerator } from "@utils/otpGenerator";
import { createSession } from "@utils/sessions";
import { getUserForResendOtpQuery } from "../model/auth.queries";
import { deleteUserSessions } from "../utils/sessions";

const OTP_TTL_SECONDS = 300;
const MAX_OTP_ATTEMPTS = 5;
// One place that decides what "the same email" means.
const cleanEmail = (email: string) => email.trim().toLowerCase();

type OtpPurpose = "otp" | "password-reset";

const codeKey = (purpose: OtpPurpose, email: string) => `${purpose}:${email}`;
const attemptsKey = (purpose: OtpPurpose, email: string) =>
  `${purpose}-attempts:${email}`;

// Saves a fresh code. A new code also starts a fresh set of tries.
const storeOtp = async (purpose: OtpPurpose, email: string, otp: string) => {
  await redisClient.set(codeKey(purpose, email), otp, { EX: OTP_TTL_SECONDS });
  await redisClient.del(attemptsKey(purpose, email));
};

// Checks a code. After MAX_OTP_ATTEMPTS the code is
// deleted and the user has to ask for a new one.
const checkOtp = async (purpose: OtpPurpose, email: string, otp: string) => {
  const attempts = await redisClient.incr(attemptsKey(purpose, email));

  if (attempts === 1) {
    await redisClient.expire(attemptsKey(purpose, email), OTP_TTL_SECONDS);
  }

  if (attempts > MAX_OTP_ATTEMPTS) {
    await redisClient.del(codeKey(purpose, email));
    return false;
  }

  const storedOtp = await redisClient.get(codeKey(purpose, email));
  return storedOtp !== null && storedOtp === otp;
};

const clearOtp = async (purpose: OtpPurpose, email: string) => {
  await redisClient.del([codeKey(purpose, email), attemptsKey(purpose, email)]);
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
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const found = (await pool.query(getUserByEmail, [email])).rows[0];

  if (found?.is_verified) {
    throw new Error("Email already exists");
  }

  let user;
  try {
    // A never-verified account is taken over by whoever signs up now.
    const result = found
      ? await pool.query(takeOverUnverifiedUserQuery, [
          name,
          hashedPassword,
          language,
          email,
        ])
      : await pool.query(createUserQuery, [
          name,
          email,
          hashedPassword,
          language,
        ]);
    user = result.rows[0];
  } catch (error: any) {
    if (error?.code === "23505") {
      throw new Error("Email already exists");
    }
    throw error;
  }

  if (!user) {
    throw new Error("Email already exists");
  }

  const otp = otpGenerator();
  await storeOtp("otp", user.email, otp);
  await sendOtpEmail(user.email, otp);

  return { id: user.id, email: user.email };
};

export const verifyOtpService = async (data: {
  email: string;
  otp: string;
}) => {
  const email = cleanEmail(data.email);

  if (!(await checkOtp("otp", email, data.otp))) {
    throw new Error("Invalid or expired OTP");
  }

  const result = await pool.query(updateUserVerifiedQuery, [email]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];
  await clearOtp("otp", email);

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
    throw new Error("Invalid credentials");
  }
  const user = result.rows[0];

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email first");
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
    const hashedPassword = await bcrypt.hash(initialPassword, 10);

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

  const hashedPassword = await bcrypt.hash(password, 10);
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
    const otp = otpGenerator();

    await storeOtp("otp", email, otp);
    await sendOtpEmail(email, otp);
  }

  return { email };
};

export const forgotPasswordService = async (rawEmail: string) => {
  const email = cleanEmail(rawEmail);
  const result = await pool.query(getUserByEmail, [email]);

  const user = result.rows[0];

  // Same answer whether or not the account exists (see resendOtpService).
  if (user) {
    const otp = otpGenerator();

    await storeOtp("password-reset", email, otp);
    await sendOtpEmail(email, otp);
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
    throw new Error("Invalid or expired OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await pool.query(updateUserPasswordQuery, [
    hashedPassword,
    email,
  ]);

  if (!result.rows[0]) {
    throw new Error("User not found");
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
    throw new Error("User not found");
  }

  const matches = await bcrypt.compare(
    currentPassword,
    result.rows[0].password,
  );

  if (!matches) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(updateUserPasswordByIdQuery, [hashedPassword, userId]);

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

  return result.rows[0];
};
