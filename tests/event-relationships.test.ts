import assert from "node:assert/strict";
import cookieParser from "cookie-parser";
import express from "express";
import type { AddressInfo } from "node:net";
import { test, type TestContext } from "node:test";
import { pool } from "../src/database/db";
import { getUserRoleQuery } from "../src/model/auth.queries";
import { createEventQuery, updateEventQuery } from "../src/model/event.queries";
import eventRoutes from "../src/routes/event.routes";
import eventPeopleRoutes from "../src/routes/eventPeople.routes";
import eventPlaceRoutes from "../src/routes/eventPlace.routes";
import { redisClient } from "../src/config/redis";

type QueryStub = (
  text: string,
  values?: unknown[],
) => Promise<{ rows: Record<string, unknown>[] }>;

const startApi = async (
  t: TestContext,
  queryStub: QueryStub,
) => {
  const originalQuery = pool.query;

  pool.query = queryStub as typeof pool.query;
  t.mock.method(redisClient, "get", async () => JSON.stringify({ userId: 7 }));
  t.mock.method(redisClient, "expire", async () => 1);

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/events", eventRoutes);
  app.use(eventPeopleRoutes);
  app.use(eventPlaceRoutes);

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
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    get: (path: string, authenticated = true) =>
      fetch(`${baseUrl}${path}`, {
        headers: authenticated ? { Cookie: "sessionId=test-session" } : {},
      }),
    post: (path: string, body: unknown) =>
      fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          Cookie: "sessionId=test-session",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }),
    patch: (path: string, body: unknown) =>
      fetch(`${baseUrl}${path}`, {
        method: "PATCH",
        headers: {
          Cookie: "sessionId=test-session",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }),
  };
};

test("event create/update handles nullable section and duplicate slugs", async (t) => {
  const insertedValues: unknown[][] = [];
  const api = await startApi(t, async (query, values = []) => {
    if (query === getUserRoleQuery) {
      return { rows: [{ role: "admin" }] };
    }

    if (query === createEventQuery) {
      insertedValues.push(values);
      if (values[2] === "duplicate") {
        throw Object.assign(new Error("unique violation"), { code: "23505" });
      }
      return { rows: [{ id: 12, section_id: values[0], slug: values[2] }] };
    }

    if (query === updateEventQuery) {
      throw Object.assign(new Error("unique violation"), { code: "23505" });
    }

    throw new Error(`Unexpected query: ${query}`);
  });

  const created = await api.post("/events", {
    title: "Unsectioned event",
    slug: "unsectioned-event",
  });
  assert.equal(created.status, 201);
  assert.equal(insertedValues[0][0], null);

  const duplicateCreate = await api.post("/events", {
    sectionId: 12,
    title: "Duplicate event",
    slug: "duplicate",
  });
  assert.equal(duplicateCreate.status, 409);

  const duplicateUpdate = await api.patch("/events/12", {
    slug: "duplicate",
  });
  assert.equal(duplicateUpdate.status, 409);
});

test("admin event relationship endpoints", async (t) => {
  await t.test("includes draft event links and draft people and places", async (t) => {
    const queries: string[] = [];
    const api = await startApi(t, async (query) => {
      queries.push(query);

      if (query === getUserRoleQuery) {
        return { rows: [{ role: "admin" }] };
      }
      if (query.includes("LEFT JOIN event_people")) {
        return {
          rows: [{ id: 21, name: "Draft person", status: "draft" }],
        };
      }
      if (query.includes("LEFT JOIN event_places")) {
        return {
          rows: [{ id: 31, name: "Draft place", status: "draft" }],
        };
      }

      throw new Error(`Unexpected query: ${query}`);
    });

    const peopleResponse = await api.get("/admin/events/12/people");
    const peopleBody = await peopleResponse.json();
    const placesResponse = await api.get("/admin/events/12/places");
    const placesBody = await placesResponse.json();

    assert.equal(peopleResponse.status, 200);
    assert.equal(peopleBody.data[0].status, "draft");
    assert.equal(peopleBody.data[0].name, "Draft person");
    assert.equal("event_id" in peopleBody.data[0], false);
    assert.equal(placesResponse.status, 200);
    assert.equal(placesBody.data[0].status, "draft");
    assert.equal(placesBody.data[0].name, "Draft place");
    assert.equal("event_id" in placesBody.data[0], false);
    assert.ok(queries.some((query) => query.includes("FROM events e")));
    assert.ok(
      queries
        .filter((query) => query.includes("LEFT JOIN event_"))
        .every((query) => !/\bstatus\b/i.test(query)),
    );
  });

  await t.test("returns empty arrays for events without linked records", async (t) => {
    const api = await startApi(t, async (query) => {
      if (query === getUserRoleQuery) {
        return { rows: [{ role: "admin" }] };
      }
      if (
        query.includes("LEFT JOIN event_people") ||
        query.includes("LEFT JOIN event_places")
      ) {
        return { rows: [{ id: null, name: null }] };
      }

      throw new Error(`Unexpected query: ${query}`);
    });

    const peopleResponse = await api.get("/admin/events/12/people");
    const placesResponse = await api.get("/admin/events/12/places");

    assert.deepEqual((await peopleResponse.json()).data, []);
    assert.deepEqual((await placesResponse.json()).data, []);
  });

  await t.test("rejects malformed IDs and returns 404 for missing events", async (t) => {
    const api = await startApi(t, async (query) => {
      if (query === getUserRoleQuery) {
        return { rows: [{ role: "admin" }] };
      }
      if (
        query.includes("LEFT JOIN event_people") ||
        query.includes("LEFT JOIN event_places")
      ) {
        return { rows: [] };
      }

      throw new Error(`Unexpected query: ${query}`);
    });

    const invalidResponse = await api.get("/admin/events/not-an-id/people");
    const missingResponse = await api.get("/admin/events/404/places");

    assert.equal(invalidResponse.status, 400);
    assert.equal(missingResponse.status, 404);
  });

  await t.test("requires an admin role", async (t) => {
    const api = await startApi(t, async (query) => {
      if (query === getUserRoleQuery) {
        return { rows: [{ role: "visitor" }] };
      }

      throw new Error(`Unexpected query: ${query}`);
    });

    const unauthenticatedResponse = await api.get(
      "/admin/events/12/people",
      false,
    );
    const visitorResponse = await api.get("/admin/events/12/places");

    assert.equal(unauthenticatedResponse.status, 401);
    assert.equal(visitorResponse.status, 403);
  });
});
