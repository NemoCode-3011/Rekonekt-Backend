import type { PoolClient } from "pg";
import { pool } from "../database/db";
import {
  createWonderQuery,
  updateWonderQuery,
  deleteWonderQuery,
  getPublishedWondersQuery,
  getWonderBySlugQuery,
  getWonderByIdQuery,
  getWonderByIdForUpdateQuery,
  getWonderReferencesQuery,
  deleteWonderReferencesQuery,
  insertWonderReferenceQuery,
} from "../model/wonders.queries";
import type {
  CreateWonderInput,
  UpdateWonderInput,
  WonderReferenceInput,
} from "../validation/wonder.schema";

// Replaces all of a wonder's links, keeping them in the order they were sent.
const saveReferences = async (
  client: PoolClient,
  wonderId: number,
  references: WonderReferenceInput[],
) => {
  await client.query(deleteWonderReferencesQuery, [wonderId]);

  for (const [index, reference] of references.entries()) {
    await client.query(insertWonderReferenceQuery, [
      wonderId,
      reference.label,
      reference.url,
      reference.note ?? null,
      index,
    ]);
  }
};

const readReferences = async (wonderId: number) => {
  const result = await pool.query(getWonderReferencesQuery, [wonderId]);

  return result.rows;
};

export const createWonderService = async (data: CreateWonderInput) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(createWonderQuery, [
      data.title,
      data.slug,
      data.wonderType,
      data.summary ?? null,
      data.content ?? null,
      data.region ?? null,
      data.latitude ?? null,
      data.longitude ?? null,
      data.coverImageUrl ?? null,
      data.coverImageAlt ?? null,
      data.coverImageCredit ?? null,
      data.videoUrl ?? null,
    ]);

    const wonder = result.rows[0];
    await saveReferences(client, wonder.id, data.references ?? []);
    await client.query("COMMIT");

    return { ...wonder, references: await readReferences(wonder.id) };
  } catch (error: any) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      throw new Error("Wonder slug already exists");
    }

    throw error;
  } finally {
    client.release();
  }
};

export const updateWonderService = async (
  id: number,
  changes: UpdateWonderInput,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = (await client.query(getWonderByIdForUpdateQuery, [id]))
      .rows[0];

    if (!existing) {
      throw new Error("Wonder not found");
    }

    // Left out = keep what is saved. null = clear it.
    const pick = <T>(change: T | undefined, saved: T) =>
      change === undefined ? saved : change;

    const result = await client.query(updateWonderQuery, [
      pick(changes.title, existing.title),
      pick(changes.slug, existing.slug),
      pick(changes.wonderType, existing.wonder_type),
      pick(changes.summary, existing.summary),
      pick(changes.content, existing.content),
      pick(changes.region, existing.region),
      pick(changes.latitude, existing.latitude),
      pick(changes.longitude, existing.longitude),
      pick(changes.coverImageUrl, existing.cover_image_url),
      pick(changes.coverImageAlt, existing.cover_image_alt),
      pick(changes.coverImageCredit, existing.cover_image_credit),
      pick(changes.videoUrl, existing.video_url),
      id,
    ]);

    if (changes.references !== undefined) {
      await saveReferences(client, id, changes.references);
    }

    await client.query("COMMIT");

    return { ...result.rows[0], references: await readReferences(id) };
  } catch (error: any) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      throw new Error("Wonder slug already exists");
    }

    throw error;
  } finally {
    client.release();
  }
};

export const deleteWonderService = async (id: number) => {
  const result = await pool.query(deleteWonderQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Wonder not found");
  }

  return result.rows[0];
};

export const getPublishedWondersService = async (type?: string) => {
  const result = await pool.query(getPublishedWondersQuery, [type ?? null]);

  return result.rows;
};

export const getWonderBySlugService = async (slug: string) => {
  const result = await pool.query(getWonderBySlugQuery, [slug]);
  const wonder = result.rows[0];

  if (!wonder) {
    return undefined;
  }

  return { ...wonder, references: await readReferences(wonder.id) };
};

// For the admin editor: works for drafts too.
export const getAdminWonderByIdService = async (id: number) => {
  const result = await pool.query(getWonderByIdQuery, [id]);
  const wonder = result.rows[0];

  if (!wonder) {
    throw new Error("Wonder not found");
  }

  return { ...wonder, references: await readReferences(id) };
};