import "dotenv/config";
import { createClient } from "redis";

// Local development may use a local Redis. Production must say where Redis is,
// so a missing value stops the server at startup instead of failing later.
const getRedisUrl = () => {
  const url = process.env.REDIS_URL;
  if (url) return url;

  if (process.env.NODE_ENV === "production") {
    throw new Error("REDIS_URL must be set in production.");
  }

  return "redis://localhost:6379";
};

export const redisClient = createClient({ url: getRedisUrl() });

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};