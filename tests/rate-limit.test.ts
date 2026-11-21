import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import { errorHandler } from "../src/middleware/errorHandler";
import { createAuthLimiter } from "../src/middleware/rateLimit.middleware";
import { redisClient } from "../src/config/redis";
import { runRateLimitRedisCommand } from "./support/rateLimitRedis";

test("shared Redis limits isolate IPs and independent actions", async (t) => {
  const originalSharedLimit = process.env.TEST_SHARED_LIMIT;
  const originalOtherLimit = process.env.TEST_OTHER_LIMIT;
  process.env.TEST_SHARED_LIMIT = "1";
  process.env.TEST_OTHER_LIMIT = "1";

  const counters = new Map<string, { hits: number; expiresAt: number }>();
  t.mock.method(redisClient, "sendCommand", async (args: readonly unknown[]) =>
    runRateLimitRedisCommand(args, counters),
  );

  const app = express();
  app.set("trust proxy", 1);
  app.get("/instance-a", createAuthLimiter("TEST_SHARED_LIMIT", 1), (_req, res) =>
    res.sendStatus(200),
  );
  app.get("/instance-b", createAuthLimiter("TEST_SHARED_LIMIT", 1), (_req, res) =>
    res.sendStatus(200),
  );
  app.get("/other-action", createAuthLimiter("TEST_OTHER_LIMIT", 1), (_req, res) =>
    res.sendStatus(200),
  );

  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });

    if (originalSharedLimit === undefined) delete process.env.TEST_SHARED_LIMIT;
    else process.env.TEST_SHARED_LIMIT = originalSharedLimit;
    if (originalOtherLimit === undefined) delete process.env.TEST_OTHER_LIMIT;
    else process.env.TEST_OTHER_LIMIT = originalOtherLimit;
  });

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const request = (path: string, ip: string) =>
    fetch(`${baseUrl}${path}`, {
      headers: { "X-Forwarded-For": ip },
    });

  assert.equal((await request("/instance-a", "203.0.113.10")).status, 200);
  assert.equal((await request("/instance-b", "203.0.113.10")).status, 429);
  assert.equal((await request("/instance-b", "203.0.113.11")).status, 200);
  assert.equal((await request("/other-action", "203.0.113.10")).status, 200);
});

test("Redis rate-limit failures reject requests with a structured 503", async (t) => {
  t.mock.method(redisClient, "sendCommand", async () => {
    throw new Error("Redis connection failed");
  });

  const app = express();
  app.get(
    "/limited",
    createAuthLimiter("TEST_FAILED_STORE_LIMIT", 1),
    (_req, res) => res.sendStatus(200),
  );
  app.use(errorHandler);

  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  );

  const address = server.address() as AddressInfo;
  const response = await fetch(`http://127.0.0.1:${address.port}/limited`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    code: "RATE_LIMIT_STORE_UNAVAILABLE",
    message: "Rate limiting is temporarily unavailable",
    data: null,
  });
});
