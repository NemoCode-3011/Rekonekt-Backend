import { pool } from "../database/db";
import {
  createArtifactQuery,
  getArtifactsQuery,
  getArtifactsBySectionQuery,
  getArtifactByIdQuery,
  updateArtifactQuery,
  deleteArtifactQuery,
} from "../model/artifacts.queries";

export const createArtifact = async (
  sectionId: number,
  title: string,
  slug: string,
  artifactType: string | null,
  description: string | null,
  historicalContext: string | null,
  dateDisplay: string | null,
  placeId: number | null,
) => {
  const client = await pool.connect();

  try {
    const result = await client.query(createArtifactQuery, [
      sectionId,
      title,
      slug,
      artifactType,
      description,
      historicalContext,
      dateDisplay,
      placeId,
    ]);

    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getArtifacts = async () => {
  const result = await pool.query(getArtifactsQuery);

  return result.rows;
};

export const getArtifactsBySection = async (sectionId: number) => {
  const result = await pool.query(getArtifactsBySectionQuery, [sectionId]);

  return result.rows;
};

export const getArtifactById = async (id: number) => {
  const result = await pool.query(getArtifactByIdQuery, [id]);

  return result.rows[0];
};

export const updateArtifact = async (
  id: number,
  sectionId: number,
  title: string,
  slug: string,
  artifactType: string | null,
  description: string | null,
  historicalContext: string | null,
  dateDisplay: string | null,
  placeId: number | null,
) => {
  const client = await pool.connect();

  try {
    const result = await client.query(updateArtifactQuery, [
      sectionId,
      title,
      slug,
      artifactType,
      description,
      historicalContext,
      dateDisplay,
      placeId,
      id,
    ]);

    return result.rows[0];
  } finally {
    client.release();
  }
};

export const deleteArtifact = async (id: number) => {
  const client = await pool.connect();

  try {
    const result = await client.query(deleteArtifactQuery, [id]);

    return result.rows[0];
  } finally {
    client.release();
  }
};
