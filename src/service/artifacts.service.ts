import { pool } from "../database/db";
import {
  createArtifactQuery,
  getArtifactsQuery,
  getArtifactsBySectionQuery,
  getArtifactByIdQuery,
  updateArtifactQuery,
  deleteArtifactQuery,
  getArtifactBySlugQuery,
  getArtifactBundlesQuery,
} from "../model/artifacts.queries";
import { providedKeys } from "../utils/providedKeys";
export const createArtifactService = async (artifactData: {
  sectionId: number | null;
  title: string;
  slug: string;
  artifactType: string | null;
  description: string | null;
  historicalContext: string | null;
  dateDisplay: string | null;
  placeId: number | null;
}) => {
  const client = await pool.connect();

  try {
    const result = await client.query(createArtifactQuery, [
      artifactData.sectionId,
      artifactData.title,
      artifactData.slug,
      artifactData.artifactType,
      artifactData.description,
      artifactData.historicalContext,
      artifactData.dateDisplay,
      artifactData.placeId,
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
  data: {
    sectionId?: number | null;
    title?: string;
    slug?: string;
    artifactType?: string;
    description?: string | null;
    historicalContext?: string | null;
    dateDisplay?: string | null;
    placeId?: number | null;
  },
) => {
  const client = await pool.connect();

  try {
    const result = await client.query(updateArtifactQuery, [
      data.sectionId ?? null,
      data.title ?? null,
      data.slug ?? null,
      data.artifactType ?? null,
      data.description ?? null,
      data.historicalContext ?? null,
      data.dateDisplay ?? null,
      data.placeId ?? null,
      providedKeys(data),
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
export const getArtifactBySlug = async (slug: string) => {
  const result = await pool.query(getArtifactBySlugQuery, [slug]);

  return result.rows[0];
};
export const getArtifactBundlesService = async () => {
  const result = await pool.query(getArtifactBundlesQuery);

  return result.rows;
};
