import { pool } from "../database/db";
import {
  createSourceQuery,
  getSourcesQuery,
  getSourceByIdQuery,
  updateSourceQuery,
  deleteSourceQuery,
} from "src/model/source.queries";

export const createSource = async (
  title: string,
  author: string | null,
  publication: string | null,
  sourceType: string | null,
  publicationDate: string | null,
  url: string | null,
  citation: string | null,
  rightsStatement: string | null,
  perspectiveNote: string | null,
) => {
  const result = await pool.query(createSourceQuery, [
    title,
    author,
    publication,
    sourceType,
    publicationDate,
    url,
    citation,
    rightsStatement,
    perspectiveNote,
  ]);

  return result.rows[0];
};

export const getSources = async () => {
  const result = await pool.query(getSourcesQuery);

  return result.rows;
};

export const getSourceById = async (id: number) => {
  const result = await pool.query(getSourceByIdQuery, [id]);

  return result.rows[0];
};

export const updateSource = async (
  id: number,
  title: string,
  author: string | null,
  publication: string | null,
  sourceType: string | null,
  publicationDate: string | null,
  url: string | null,
  citation: string | null,
  rightsStatement: string | null,
  perspectiveNote: string | null,
) => {
  const result = await pool.query(updateSourceQuery, [
    title,
    author,
    publication,
    sourceType,
    publicationDate,
    url,
    citation,
    rightsStatement,
    perspectiveNote,
    id,
  ]);

  return result.rows[0];
};

export const deleteSource = async (id: number) => {
  const result = await pool.query(deleteSourceQuery, [id]);

  return result.rows[0];
};
