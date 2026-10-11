import "dotenv/config";
import { createClient } from "redis";

// REDIS_URL lets Docker point at the Redis container (e.g. redis://redis:6379).
// Without it we fall back to a local Redis.
export const redisClient = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};