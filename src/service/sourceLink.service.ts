import { pool } from "../database/db";
import {
  createSourceLinkQuery,
  getSourceLinksQuery,
  getSourceLinkByIdQuery,
  updateSourceLinkQuery,
  deleteSourceLinkQuery,
} from "src/model/sourceLink.queries";
import type { SourceLink } from "../types/contentRelationships";

export const createSourceLinkService = async (data: {
  sourceId: number;
  sectionId?: number | null;
  eventId?: number | null;
  personId?: number | null;
  artifactId?: number | null;
  storyId?: number | null;
  placeId?: number | null;
  relationship?: string | null;
  displayOrder?: number;
}) => {
  const result = await pool.query<SourceLink>(createSourceLinkQuery, [
    data.sourceId,
    data.sectionId ?? null,
    data.eventId ?? null,
    data.personId ?? null,
    data.artifactId ?? null,
    data.storyId ?? null,
    data.placeId ?? null,
    data.relationship ?? null,
    data.displayOrder ?? 0,
  ]);

  return result.rows[0];
};

export const getSourceLinks = async () => {
  const result = await pool.query(getSourceLinksQuery);

  return result.rows;
};

export const getSourceLinkById = async (id: number) => {
  const result = await pool.query<SourceLink>(getSourceLinkByIdQuery, [id]);

  return result.rows[0];
};

export const updateSourceLinkService = async (
  id: number,
  data: {
    sourceId?: number;
    sectionId?: number | null;
    eventId?: number | null;
    personId?: number | null;
    artifactId?: number | null;
    storyId?: number | null;
    placeId?: number | null;
    relationship?: string | null;
    displayOrder?: number;
  },
) => {
  const targetKeys = [
    "sectionId",
    "eventId",
    "personId",
    "artifactId",
    "storyId",
    "placeId",
  ] as const;
  const targetChanged = targetKeys.some((key) => data[key] !== undefined);

  const result = await pool.query<SourceLink>(updateSourceLinkQuery, [
    data.sourceId ?? null,
    data.relationship ?? null,
    data.displayOrder ?? null,
    targetChanged,
    data.sectionId ?? null,
    data.eventId ?? null,
    data.personId ?? null,
    data.artifactId ?? null,
    data.storyId ?? null,
    data.placeId ?? null,
    id,
  ]);

  return result.rows[0];
};

export const deleteSourceLink = async (id: number) => {
  const result = await pool.query(deleteSourceLinkQuery, [id]);

  return result.rows[0];
};
