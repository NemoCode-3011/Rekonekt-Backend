const isProduction = process.env.NODE_ENV === "production";

// Used when logging in (setting the cookie)
export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  // "none" lets a deployed frontend on another domain send the cookie.
  // "lax" is fine for localhost.
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Used when logging out (clearing the cookie).
// Must match the login options, minus maxAge.
export const clearSessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};