import bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { pool } from "../database/db";
import { redisClient } from "../config/redis";
import {
  createAdminQuery,
  createUserQuery,
  getUserByEmail,
  getUserById,
  updateUserVerifiedQuery,
} from "../model/auth.queries";
import { sendOtpEmail } from "../utils/email"; // change to where your email function lives
import { otpGenerator } from "@utils/otpGenerator";
import { createSession } from "@utils/sessions";

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
  password: string;
  preferredLanguage?: string;
}) => {
  const client = await pool.connect();

  try {
    const emailExists = await client.query(getUserByEmail, [data.email]);

    if (emailExists.rows.length > 0) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await client.query(createAdminQuery, [
      data.name,
      data.email,
      hashedPassword,
      data.preferredLanguage ?? "en",
    ]);

    return result.rows[0];
  } catch (error: any) {
    if (error?.code === "23505") {
      throw new Error("Email already exists");
    }

    throw error;
  } finally {
    client.release();
  }
};