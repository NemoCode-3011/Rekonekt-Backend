import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "./db";
import { createSuperAdminQuery } from "../model/auth.queries";

const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

if (!SUPER_ADMIN_NAME || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
  throw new Error("Super admin credentials are missing");
}

const seed = async () => {
  try {
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
    const result = await pool.query(createSuperAdminQuery, [
      SUPER_ADMIN_NAME,
      SUPER_ADMIN_EMAIL,
      hashedPassword,
    ]);

    if (result.rows.length === 0) {
      console.log("Super admin already exists.");
    } else {
      console.log("Super admin created:", result.rows[0]);
    }
  } catch (error: any) {
    console.error("Seed failed:", error.message);
  } finally {
    await pool.end();
  }
};

seed();
