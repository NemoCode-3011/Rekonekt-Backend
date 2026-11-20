import { pool } from "../database/db";
import {
  addEventPlaceQuery,
  getAdminPlacesByEventQuery,
  getPlacesByEventQuery,
  removeEventPlaceQuery,
} from "src/model/eventPlaces.queries";

export const addEventPlace = async (eventId: number, placeId: number) => {
  const result = await pool.query(addEventPlaceQuery, [eventId, placeId]);
  return result.rows[0];
};

export const getPlacesByEvent = async (eventId: number) => {
  const result = await pool.query(getPlacesByEventQuery, [eventId]);
  return result.rows;
};

export const getAdminPlacesByEvent = async (eventId: number) => {
  const result = await pool.query(getAdminPlacesByEventQuery, [eventId]);

  if (result.rows.length === 0) {
    throw new Error("Event not found");
  }

  return result.rows.filter((place) => place.id !== null);
};

export const removeEventPlace = async (eventId: number, placeId: number) => {
  const result = await pool.query(removeEventPlaceQuery, [eventId, placeId]);
  return result.rows[0];
};
