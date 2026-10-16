import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please wait a few minutes and try again.",
  },
});

export const publicReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.PUBLIC_READ_LIMIT) || 600,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== "GET",
  message: {
    message: "Too many requests. Please slow down and try again shortly.",
  },
});