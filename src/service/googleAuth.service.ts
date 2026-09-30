import crypto from "crypto";
import bcrypt from "bcrypt";
import googleClient from "src/config/google";
import { pool } from "../database/db";
import { createSession } from "../utils/sessions";
import {
  getUserByGoogleIdQuery,
  getUserByEmailForGoogleQuery,
  linkGoogleAccountQuery,
  createGoogleUserQuery,
} from "src/model/auth.queries";

export const authenticateWithGoogle = async (
  credential: string
) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid Google account");
  }

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name || "REKONEKT User";

  // 1. Check Google ID
  const googleUser = await pool.query(
    getUserByGoogleIdQuery,
    [googleId]
  );

  let user = googleUser.rows[0];

  // 2. If Google ID doesn't exist, check email
  if (!user) {
    const emailUser = await pool.query(
      getUserByEmailForGoogleQuery,
      [email]
    );

    if (emailUser.rows[0]) {
      const linkedUser = await pool.query(
        linkGoogleAccountQuery,
        [googleId, emailUser.rows[0].id]
      );

      user = linkedUser.rows[0];
    }
  }

  // 3. Create new user
  if (!user) {
    const randomPassword = crypto
      .randomBytes(32)
      .toString("hex");

    const hashedPassword = await bcrypt.hash(
      randomPassword,
      10
    );

    const newUser = await pool.query(
      createGoogleUserQuery,
      [
        name,
        email,
        hashedPassword,
        googleId,
      ]
    );

    user = newUser.rows[0];
  }

  // 4. Create normal REKONEKT session
  const sessionId = await createSession(user.id);

  return {
    user,
    sessionId,
  };
};