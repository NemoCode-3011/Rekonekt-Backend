import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import { verifyRequestOrigin } from "../src/middleware/requestOrigin.middleware";

test("state-changing requests reject untrusted browser origins", async (t) => {
  const app = express();
  let writeCount = 0;

  app.use(verifyRequestOrigin("https://client.example"));
  app.get("/read", (_req, res) => res.sendStatus(200));
  app.post("/upload", (_req, res) => {
    writeCount += 1;
    res.sendStatus(204);
  });

  const server = createServer(app);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const blocked = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    headers: { Origin: "https://untrusted.example" },
  });
  assert.equal(blocked.status, 403);
  assert.equal(writeCount, 0);

  const trusted = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    headers: { Origin: "https://client.example" },
  });
  assert.equal(trusted.status, 204);
  assert.equal(writeCount, 1);

  const serverClient = await fetch(`${baseUrl}/upload`, { method: "POST" });
  assert.equal(serverClient.status, 204);
  assert.equal(writeCount, 2);

  const publicRead = await fetch(`${baseUrl}/read`, {
    headers: { Origin: "https://untrusted.example" },
  });
  assert.equal(publicRead.status, 200);
});
