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
} from "../model/auth.queries";
import { sendAdminSetupEmail, sendOtpEmail } from "../utils/email";
import { otpGenerator } from "@utils/otpGenerator";
import { createSession } from "@utils/sessions";
import { getUserForResendOtpQuery } from "../model/auth.queries";
import { deleteUserSessions } from "../utils/sessions";
interface SignUpInput {
  name: string;
  email: string;
  password: string;
  preferredLanguage?: string;
}

export const signUpService = async (data: SignUpInput) => {
  const email = data.email.trim().toLowerCase();

  const existing = await pool.query(getUserByEmail, [email]);
  if (existing.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  let user;
  try {
    const { rows } = await pool.query(createUserQuery, [
      data.name.trim(),
      email,
      hashedPassword,
      data.preferredLanguage ?? "en",
    ]);
    user = rows[0];
  } catch (error: any) {
    if (error?.code === "23505") {
      throw new Error("Email already exists");
    }
    throw error;
  }

  const otp = otpGenerator();
  await redisClient.set(`otp:${user.email}`, otp, { EX: 300 });
  await sendOtpEmail(user.email, otp);

  return {
    id: user.id,
    email: user.email,
  };
};

export const verifyOtpService = async (data: {
  email: string;
  otp: string;
}) => {
  const email = data.email.trim().toLowerCase();
  const storedOtp = await redisClient.get(`otp:${email}`);

  if (!storedOtp || storedOtp !== data.otp) {
    throw new Error("Invalid or expired OTP");
  }

  const result = await pool.query(updateUserVerifiedQuery, [email]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];
  await redisClient.del(`otp:${email}`);

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
  const result = await pool.query(getUserByEmail, [data.email]);

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

    const clientUrl = (process.env.CLIENT_URL ?? "http://localhost:5173").replace(
      /\/+$/,
      "",
    );
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

export const resendOtpService = async (email: string) => {
  const result = await pool.query(getUserForResendOtpQuery, [email]);

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  if (user.is_verified) {
    throw new Error("Email is already verified");
  }

  const otp = otpGenerator();

  await redisClient.set(`otp:${email}`, otp, { EX: 300 });

  await sendOtpEmail(email, otp);

  return {
    email: user.email,
  };
};

export const forgotPasswordService = async (email: string) => {
  const result = await pool.query(getUserByEmail, [email]);

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const otp = otpGenerator();

  await redisClient.set(`password-reset:${email}`, otp, { EX: 300 });

  await sendOtpEmail(email, otp);

  return {
    email: user.email,
  };
};

export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const storedOtp = await redisClient.get(`password-reset:${email}`);

  if (!storedOtp || storedOtp !== otp) {
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

  await redisClient.del(`password-reset:${email}`);

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