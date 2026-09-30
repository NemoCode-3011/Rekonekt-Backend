import crypto from "crypto";
import bcrypt from "bcrypt";
import googleClient from "src/config/google";
import {
  getUserByGoogleIdQuery,
  createGoogleUserQuery,
} from "src/model/auth.queries";
import { pool } from "../database/db";
import { createSession } from "../utils/sessions";

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

  const existingUser = await pool.query(
    getUserByGoogleIdQuery,
    [googleId]
  );

  let user = existingUser.rows[0];

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(
      randomPassword,
      10
    );

    const result = await pool.query(
      createGoogleUserQuery,
      [
        name,
        email,
        hashedPassword,
        googleId,
      ]
    );

    user = result.rows[0];
  }

  const sessionId = await createSession(user.id);

  return {
    user,
    sessionId,
  };
};