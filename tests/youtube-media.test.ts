import assert from "node:assert/strict";
import cookieParser from "cookie-parser";
import express from "express";
import type { AddressInfo } from "node:net";
import { test, type TestContext } from "node:test";
import { pool } from "../src/database/db";
import { redisClient } from "../src/config/redis";
import { createMediaQuery } from "../src/model/media.queries";
import { getMediaQuery } from "../src/model/media.queries";
import { getAdminEventMediaQuery } from "../src/model/mediaAttachments.queries";
import { getUserRoleQuery } from "../src/model/auth.queries";
import mediaRoutes from "../src/routes/media.routes";
import eventMediaRoutes from "../src/routes/eventMedia.routes";
import { parseYouTubeVideoUrl } from "../src/utils/youtube";

test("YouTube URL parsing", () => {
  assert.deepEqual(
    parseYouTubeVideoUrl("https://youtu.be/dQw4w9WgXcQ?t=15"),
    {
      videoId: "dQw4w9WgXcQ",
      canonicalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    },
  );
  assert.equal(
    parseYouTubeVideoUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")?.videoId,
    "dQw4w9WgXcQ",
  );
  assert.equal(
    parseYouTubeVideoUrl("https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ"),
    null,
  );
  assert.equal(
    parseYouTubeVideoUrl("https://www.youtube.com/watch?v=not-a-video-id"),
    null,
  );
});

test("YouTube media endpoint stores a canonical URL and returns an embed URL", async (t: TestContext) => {
  const originalQuery = pool.query;
  const insertedFiles: unknown[] = [];
  const mediaRows: Record<string, unknown>[] = [];

  pool.query = (async (query: string, values?: unknown[]) => {
    if (query === getUserRoleQuery) {
      return { rows: [{ role: "admin" }] };
    }

    if (query === createMediaQuery) {
      insertedFiles.push(values?.[2]);
      const media = {
        id: 5,
        title: values?.[0],
        media_type: values?.[1],
        file_url: values?.[2],
      };
      mediaRows.push(media);
      return { rows: [media] };
    }

    if (query === getMediaQuery) {
      return { rows: mediaRows };
    }

    if (query === getAdminEventMediaQuery) {
      return {
        rows: mediaRows.map((media) => ({
          ...media,
          attachment_id: 9,
          display_order: 0,
        })),
      };
    }

    throw new Error(`Unexpected query: ${query}`);
  }) as typeof pool.query;
  t.mock.method(redisClient, "get", async () => JSON.stringify({ userId: 7 }));
  t.mock.method(redisClient, "expire", async () => 1);

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/media", mediaRoutes);
  app.use(eventMediaRoutes);

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
    pool.query = originalQuery;
  });

  const address = server.address() as AddressInfo;
  const endpoint = `http://127.0.0.1:${address.port}/media/youtube`;
  const validResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Cookie: "sessionId=test-session",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Test video",
      youtubeUrl: "https://youtu.be/dQw4w9WgXcQ?t=15",
    }),
  });
  const validBody = await validResponse.json();

  assert.equal(validResponse.status, 201);
  assert.equal(
    insertedFiles[0],
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  );
  assert.equal(validBody.data.media_type, "video");
  assert.equal(validBody.data.video_provider, "youtube");
  assert.equal(
    validBody.data.embed_url,
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  );

  const listResponse = await fetch("http://127.0.0.1:" + address.port + "/media");
  const listBody = await listResponse.json();
  assert.equal(listBody.data[0].embed_url, validBody.data.embed_url);

  const adminEventMediaResponse = await fetch(
    `http://127.0.0.1:${address.port}/admin/events/12/media`,
    { headers: { Cookie: "sessionId=test-session" } },
  );
  const adminEventMediaBody = await adminEventMediaResponse.json();
  assert.equal(adminEventMediaResponse.status, 200);
  assert.equal(adminEventMediaBody.data[0].video_provider, "youtube");
  assert.equal(adminEventMediaBody.data[0].attachment_id, 9);

  const invalidResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Cookie: "sessionId=test-session",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Invalid video",
      youtubeUrl: "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
    }),
  });

  assert.equal(invalidResponse.status, 400);
  assert.equal(insertedFiles.length, 1);
});
