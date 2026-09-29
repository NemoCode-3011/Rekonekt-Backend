import crypto from "crypto";
import { redisClient } from "src/config/redis";

export const createSession = async (userId: number) => {
  const sessionId = crypto.randomUUID();

  await redisClient.set(
    `session:${sessionId}`,
    JSON.stringify({ userId }),
    {
      EX: 60 * 60 * 24 * 7,
    }
  );

  return sessionId;
};