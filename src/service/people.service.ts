import { pool } from "src/database/db";

import {
  createPersonQuery,
  getPeopleQuery,
  getPersonByIdQuery,
  updatePersonQuery,
  deletePersonQuery,
} from "../model/people.queries";

export const createPersonService = async (data: {
  name: string;
  slug: string;
  description?: string;
  birthDate?: string;
  deathDate?: string;
}) => {
  try {
    const result = await pool.query(createPersonQuery, [
      data.name,
      data.slug,
      data.description ?? null,
      data.birthDate ?? null,
      data.deathDate ?? null,
    ]);

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Person slug already exists");
    }

    throw error;
  }
};

export const getPeopleService = async () => {
  const result = await pool.query(getPeopleQuery);

  return result.rows;
};

export const getPersonByIdService = async (id: number) => {
  const result = await pool.query(getPersonByIdQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Person not found");
  }

  return result.rows[0];
};

export const updatePersonService = async (
  id: number,
  data: {
    name: string;
    slug: string;
    description?: string;
    birthDate?: string;
    deathDate?: string;
  },
) => {
  try {
    const result = await pool.query(updatePersonQuery, [
      data.name,
      data.slug,
      data.description ?? null,
      data.birthDate ?? null,
      data.deathDate ?? null,
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Person not found");
    }

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Person slug already exists");
    }

    throw error;
  }
};

export const deletePersonService = async (id: number) => {
  const result = await pool.query(deletePersonQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Person not found");
  }

  return result.rows[0];
};
