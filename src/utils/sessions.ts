import crypto from "crypto";
import { redisClient } from "src/config/redis";


export const SESSION_TTL_SECONDS = 60 * 60 * 24;
export const createSession = async (userId: number) => {
  const sessionId = crypto.randomUUID();

  await redisClient.set(
    `session:${sessionId}`,
    JSON.stringify({ userId }),
    {
     EX: SESSION_TTL_SECONDS,
    }
  );

  return sessionId;
};

export const deleteUserSessions = async (userId: number) => {
  const keys = await redisClient.keys("session:*");

  for (const key of keys) {
    const session = await redisClient.get(key);

    if (!session) continue;

    const parsedSession = JSON.parse(session);

    if (parsedSession.userId === userId) {
      await redisClient.del(key);
    }
  }
};