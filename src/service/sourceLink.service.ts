import { pool } from "../database/db";
import {
  createSourceLinkQuery,
  getSourceLinksQuery,
  getSourceLinkByIdQuery,
  updateSourceLinkQuery,
  deleteSourceLinkQuery,
} from "src/model/sourceLink.queries";

export const createSourceLinkService = async (
  sourceId: number,
  sectionId: number | null,
  eventId: number | null,
  personId: number | null,
  artifactId: number | null,
  relationship: string | null,
  displayOrder: number,
) => {
  const result = await pool.query(createSourceLinkQuery, [
    sourceId,
    sectionId,
    eventId,
    personId,
    artifactId,
    relationship,
    displayOrder,
  ]);

  return result.rows[0];
};

export const getSourceLinks = async () => {
  const result = await pool.query(getSourceLinksQuery);

  return result.rows;
};

export const getSourceLinkById = async (id: number) => {
  const result = await pool.query(getSourceLinkByIdQuery, [id]);

  return result.rows[0];
};

export const updateSourceLinkService = async (
  id: number,
  data: {
    sourceId: number;
    sectionId: number | null;
    eventId: number | null;
    personId: number | null;
    artifactId: number | null;
    relationship: string | null;
    displayOrder: number;
  },
) => {
  const result = await pool.query(updateSourceLinkQuery, [
    data.sourceId,
    data.sectionId,
    data.eventId,
    data.personId,
    data.artifactId,
    data.relationship,
    data.displayOrder,
    id,
  ]);

  return result.rows[0];
};

export const deleteSourceLink = async (id: number) => {
  const result = await pool.query(deleteSourceLinkQuery, [id]);

  return result.rows[0];
};
