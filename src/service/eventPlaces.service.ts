import { pool } from "../database/db";
import {
  addEventPlaceQuery,
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

export const removeEventPlace = async (eventId: number, placeId: number) => {
  const result = await pool.query(removeEventPlaceQuery, [eventId, placeId]);
  return result.rows[0];
};
