import crypto from "crypto";
import bcrypt from "bcrypt";
import googleClient from "src/config/google";
import { pool } from "../database/db";
import { createSession, deleteUserSessions } from "../utils/sessions";
import {
  getUserByGoogleIdQuery,
  getUserByEmailForGoogleQuery,
  linkGoogleAccountQuery,
  createGoogleUserQuery,
  updateUserPasswordByIdQuery,
} from "src/model/auth.queries";

// Google users never type a password, so their account gets a random one.
const randomPasswordHash = () =>
  bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

// Someone already has an account with this email: attach the Google login to it.
const linkGoogleToExistingUser = async (
  existing: {
    id: number;
    role: string;
    is_verified: boolean;
    google_id: string | null;
  },
  googleId: string,
) => {
  // Admins sign in with their password, never through an email match.
  if (existing.role !== "visitor") {
    throw new Error("Staff accounts cannot use Google sign-in");
  }

  // The email already belongs to a different Google account.
  if (existing.google_id) {
    throw new Error("Email is linked to another Google account");
  }

  // This account was never verified, so whoever signed up may not own the
  // email. Google just proved the real owner is here, so cancel the old password.
  if (!existing.is_verified) {
    await pool.query(updateUserPasswordByIdQuery, [
      await randomPasswordHash(),
      existing.id,
    ]);
    await deleteUserSessions(existing.id);
  }

  const linked = await pool.query(linkGoogleAccountQuery, [
    googleId,
    existing.id,
  ]);

  return linked.rows[0];
};

export const authenticateWithGoogle = async (credential: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid Google account");
  }

  // Google must confirm the person controls this email address.
  if (!payload.email_verified) {
    throw new Error("Google email is not verified");
  }

  const googleId = payload.sub;
  const email = payload.email.trim().toLowerCase();
  const name = payload.name || "REKONEKT User";

  // 1. Known Google account
  const googleUser = await pool.query(getUserByGoogleIdQuery, [googleId]);
  let user = googleUser.rows[0];

  // 2. Same email already registered
  if (!user) {
    const emailUser = await pool.query(getUserByEmailForGoogleQuery, [email]);

    if (emailUser.rows[0]) {
      user = await linkGoogleToExistingUser(emailUser.rows[0], googleId);
    }
  }

  // 3. Brand new user
  if (!user) {
    const newUser = await pool.query(createGoogleUserQuery, [
      name,
      email,
      await randomPasswordHash(),
      googleId,
    ]);

    user = newUser.rows[0];
  }

  // 4. Normal REKO session
  const sessionId = await createSession(user.id);

  return {
    user,
    sessionId,
  };
};
