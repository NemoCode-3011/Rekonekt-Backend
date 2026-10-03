import { pool } from "../database/db";
import {
  addEventPersonQuery,
  getPeopleByEventQuery,
  removeEventPersonQuery,
} from "src/model/eventPeople.queries";

export const addEventPersonService = async (eventId: number, personId: number) => {
  const result = await pool.query(addEventPersonQuery, [eventId, personId]);

  return result.rows[0];
};

export const getPeopleByEvent = async (eventId: number) => {
  const result = await pool.query(getPeopleByEventQuery, [eventId]);

  return result.rows;
};

export const removeEventPerson = async (eventId: number, personId: number) => {
  const result = await pool.query(removeEventPersonQuery, [eventId, personId]);

  return result.rows[0];
};
