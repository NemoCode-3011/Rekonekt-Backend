import { pool } from "../database/db";
import {
  createPlaceQuery,
  getPlacesQuery,
  getPlaceByIdQuery,
  updatePlaceQuery,
  deletePlaceQuery,
} from "../model/places.queries";

export const createPlaceService = async (
  name: string,
  description: string | null,
  latitude: number | null,
  longitude: number | null,
) => {
  const result = await pool.query(createPlaceQuery, [
    name,
    description,
    latitude,
    longitude,
  ]);

  return result.rows[0];
};

export const getPlaces = async () => {
  const result = await pool.query(getPlacesQuery);

  return result.rows;
};

export const getPlaceById = async (id: number) => {
  const result = await pool.query(getPlaceByIdQuery, [id]);

  return result.rows[0];
};

export const updatePlaceService = async (
  id: number,
  data: {
    name: string;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
  },
) => {
  const result = await pool.query(updatePlaceQuery, [
    data.name,
    data.description,
    data.latitude,
    data.longitude,
    id,
  ]);

  return result.rows[0];
};

export const deletePlace = async (id: number) => {
  const result = await pool.query(deletePlaceQuery, [id]);

  return result.rows[0];
};
