import { SESSION_TTL_SECONDS } from "./sessions";

const isProduction = process.env.NODE_ENV === "production";

const sameSite = process.env.CROSS_SITE_COOKIES === "true" ? "none" : "lax";

const baseOptions = {
  httpOnly: true,
  secure: isProduction || sameSite === "none",
  sameSite: sameSite as "none" | "lax",
};

export const sessionCookieOptions = {
  ...baseOptions,
  maxAge: SESSION_TTL_SECONDS * 1000,
};

// Used when logging out. Must match the login options, minus maxAge.
export const clearSessionCookieOptions = baseOptions;