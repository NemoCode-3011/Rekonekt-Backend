import { pool } from "../database/db";
import {
  createPlaceQuery,
  getPlacesQuery,
  getPlaceFacetsQuery,
  getPlaceByIdQuery,
  getPlaceBySlugQuery,
  getPlaceEventsQuery,
  getPlaceArtifactsQuery,
  getNearbyPlacesQuery,
  getPlaceByIdForUpdateQuery,
  updatePlaceQuery,
  deletePlaceQuery,
} from "../model/places.queries";
import { slugify } from "../utils/slug";
import type {
  CreatePlaceInput,
  UpdatePlaceInput,
} from "../validation/place.schema";

const SLUG_TAKEN = "Place slug already exists";
const MAX_SLUG_TRIES = 20;

export const createPlaceService = async (data: CreatePlaceInput) => {
  const explicit = Boolean(data.slug);
  const base = data.slug ?? (slugify(data.name) || "place");

  // A slug an admin typed is used as it is, or refused. One made from the name
  // gets -2, -3... on the end until it is free.
  for (let attempt = 0; attempt < (explicit ? 1 : MAX_SLUG_TRIES); attempt++) {
    const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;

    try {
      const result = await pool.query(createPlaceQuery, [
        data.name,
        slug,
        data.description ?? null,
        data.summary ?? null,
        data.region ?? null,
        data.category ?? null,
        data.latitude,
        data.longitude,
        data.coverImageUrl ?? null,
        data.coverImageAlt ?? null,
        data.coverImageCredit ?? null,
      ]);

      return result.rows[0];
    } catch (error: any) {
      if (error.code !== "23505") throw error;
    }
  }

  throw new Error(SLUG_TAKEN);
};

export type PlaceFilters = {
  region?: string;
  category?: string;
  search?: string;
};

export const getPlaces = async (filters: PlaceFilters = {}) => {
  const search = filters.search?.trim();
  // % and _ typed by a visitor are plain characters, not wildcards.
  const pattern = search
    ? `%${search.replace(/[\\%_]/g, "\\$&")}%`
    : null;

  const result = await pool.query(getPlacesQuery, [
    filters.region ?? null,
    filters.category ?? null,
    pattern,
  ]);

  return result.rows;
};

type Facet = { value: string; count: number };

export const getPlaceFacets = async () => {
  const rows = (await pool.query(getPlaceFacetsQuery)).rows as {
    facet: string;
    value: string | null;
    count: number;
  }[];

  const pick = (facet: string): Facet[] =>
    rows
      .filter((row) => row.facet === facet && row.value !== null)
      .map((row) => ({ value: row.value as string, count: row.count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

  const single = (facet: string) =>
    rows.find((row) => row.facet === facet)?.count ?? 0;

  return {
    regions: pick("region"),
    categories: pick("category"),
    total: single("total"),
    pinned: single("pinned"),
  };
};

export const getPlaceById = async (id: number) => {
  const result = await pool.query(getPlaceByIdQuery, [id]);

  return result.rows[0];
};

// A place's own page: the place, what happened or was found there, and what is nearby.
export const getPlaceBySlug = async (slug: string) => {
  const place = (await pool.query(getPlaceBySlugQuery, [slug])).rows[0];

  if (!place) return undefined;

  const [events, artifacts] = await Promise.all([
    pool.query(getPlaceEventsQuery, [place.id]),
    pool.query(getPlaceArtifactsQuery, [place.id]),
  ]);

  const hasPin = place.latitude !== null && place.longitude !== null;
  const nearby = hasPin
    ? (
        await pool.query(getNearbyPlacesQuery, [
          place.id,
          place.latitude,
          place.longitude,
        ])
      ).rows
    : [];

  return {
    ...place,
    events: events.rows,
    artifacts: artifacts.rows,
    nearby,
  };
};

export const updatePlaceService = async (
  id: number,
  changes: UpdatePlaceInput,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = (await client.query(getPlaceByIdForUpdateQuery, [id]))
      .rows[0];

    if (!existing) {
      throw new Error("Place not found");
    }

    // Left out = keep what is saved. null = clear it.
    const pick = <T>(change: T | undefined, saved: T) =>
      change === undefined ? saved : change;

    const result = await client.query(updatePlaceQuery, [
      pick(changes.name, existing.name),
      pick(changes.slug, existing.slug),
      pick(changes.description, existing.description),
      pick(changes.summary, existing.summary),
      pick(changes.region, existing.region),
      pick(changes.category, existing.category),
      pick(changes.latitude, existing.latitude),
      pick(changes.longitude, existing.longitude),
      pick(changes.coverImageUrl, existing.cover_image_url),
      pick(changes.coverImageAlt, existing.cover_image_alt),
      pick(changes.coverImageCredit, existing.cover_image_credit),
      id,
    ]);

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error: any) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      throw new Error(SLUG_TAKEN);
    }

    throw error;
  } finally {
    client.release();
  }
};

export const deletePlace = async (id: number) => {
  const result = await pool.query(deletePlaceQuery, [id]);

  return result.rows[0];
};