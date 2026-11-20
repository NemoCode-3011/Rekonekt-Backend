import { randomInt } from "node:crypto";

export const otpGenerator = (length = 6): string =>
  randomInt(0, 10 ** length).toString().padStart(length, "0");
