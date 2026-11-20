import { randomUUID } from "node:crypto";
import { redisClient } from "src/config/redis";

export const SESSION_TTL_SECONDS = 60 * 60 * 24;

export const getSessionUserId = (session: string) => {
  try {
    const parsed: unknown = JSON.parse(session);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "userId" in parsed &&
      typeof parsed.userId === "number" &&
      Number.isSafeInteger(parsed.userId) &&
      parsed.userId > 0
    ) {
      return parsed.userId;
    }
  } catch {
    return null;
  }

  return null;
};

export const createSession = async (userId: number) => {
  const sessionId = randomUUID();

  await redisClient.set(`session:${sessionId}`, JSON.stringify({ userId }), {
    EX: SESSION_TTL_SECONDS,
  });

  return sessionId;
};

export const deleteUserSessions = async (
  userId: number,
  keepSessionId?: string,
) => {
  for await (const keys of redisClient.scanIterator({
    MATCH: "session:*",
    COUNT: 100,
  })) {
    for (const key of keys) {
      if (key === `session:${keepSessionId}`) continue;

      const session = await redisClient.get(key);

      if (!session) continue;

      const sessionUserId = getSessionUserId(session);
      if (sessionUserId === null || sessionUserId === userId) {
        await redisClient.del(key);
      }
    }
  }
};
