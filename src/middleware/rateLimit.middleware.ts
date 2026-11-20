import rateLimit from "express-rate-limit";

const authWindowMs = 15 * 60 * 1000;

const configuredLimit = (name: string, fallback: number) => {
  const raw = process.env[name] ?? process.env.AUTH_LIMIT;
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

const authLimitMessage =
  "Too many attempts. Please wait a few minutes and try again.";

const createAuthLimiter = (setting: string, fallback: number) =>
  rateLimit({
    windowMs: authWindowMs,
    limit: configuredLimit(setting, fallback),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ message: authLimitMessage, data: null });
    },
  });

export const signupLimiter = createAuthLimiter("SIGNUP_LIMIT", 5);
export const signinLimiter = createAuthLimiter("SIGNIN_LIMIT", 10);
export const googleAuthLimiter = createAuthLimiter("GOOGLE_AUTH_LIMIT", 10);
export const otpVerificationLimiter = createAuthLimiter(
  "OTP_VERIFY_LIMIT",
  10,
);
export const otpResendLimiter = createAuthLimiter("OTP_RESEND_LIMIT", 5);
export const passwordResetRequestLimiter = createAuthLimiter(
  "PASSWORD_RESET_REQUEST_LIMIT",
  5,
);
export const passwordResetLimiter = createAuthLimiter(
  "PASSWORD_RESET_LIMIT",
  5,
);
export const passwordChangeLimiter = createAuthLimiter(
  "PASSWORD_CHANGE_LIMIT",
  10,
);
export const adminSetupLimiter = createAuthLimiter("ADMIN_SETUP_LIMIT", 5);

export const publicReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.PUBLIC_READ_LIMIT) || 600,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== "GET",
  handler: (_req, res) => {
    res
      .status(429)
      .json({ message: "Too many requests. Please slow down and try again shortly.", data: null });
  },
});
