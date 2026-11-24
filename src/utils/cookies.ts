import { SESSION_TTL_SECONDS } from "./sessions";

const isProduction = process.env.NODE_ENV === "production";

// The frontend proxies /api to this server, so the browser sees one site and
// a plain "lax" cookie is enough (no cross-site cookie settings needed).
const baseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
};

export const sessionCookieOptions = {
  ...baseOptions,
  maxAge: SESSION_TTL_SECONDS * 1000,
};

// Used when logging out. Must match the login options, minus maxAge.
export const clearSessionCookieOptions = baseOptions;