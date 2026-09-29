// src/database/db.ts

import dotenv from "dotenv";
import { Pool } from "pg";

import {
  createCulturalGroupsTable,
  createUsersTable,
  createExhibitionsTable,
  createSectionsTable,
  createStoriesTable,
  createEventsTable,
  createPeopleTable,
  createPlacesTable,
  createArtifactsTable,
  createEventPlacesTable,
  createEventPeopleTable,
  createMediaTable,
  createMediaAttachmentsTable,
  createSourcesTable,
  createSourceLinksTable,
  createBookmarksTable,
  createNotesTable,
  createProgressTable,
  alterUsersTableAddIsVerified,
} from "./queries";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export const isDBConnected = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("db is connected", res.rows[0]);
  } catch (error) {
    console.log("db is not connected", error);
  }
};

export const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query(createCulturalGroupsTable);
    console.log("cultural_groups table created");
    await client.query(createUsersTable);
    console.log("users table created");
    await client.query(createExhibitionsTable);
    console.log("exhibitions table created");
    await client.query(createSectionsTable);
    console.log("sections table created");
    await client.query(createStoriesTable);
    console.log("stories table created");
    await client.query(createEventsTable);
    console.log("events table created");
    await client.query(createPeopleTable);
    console.log("people table created");
    await client.query(createPlacesTable);
    console.log("places table created");
    await client.query(createArtifactsTable);
    console.log("artifacts table created");
    await client.query(createEventPlacesTable);
    console.log("event_places table created");
    await client.query(createEventPeopleTable);
    console.log("event_people table created");
    await client.query(createMediaTable);
    console.log("media table created");
    await client.query(createMediaAttachmentsTable);
    console.log("media_attachments table created");
    await client.query(createSourcesTable);
    console.log(" sources table created");
    await client.query(createSourceLinksTable);
    console.log("source_links table created");
    await client.query(createBookmarksTable);
    console.log("bookmarks table created");
    await client.query(createNotesTable);
    console.log("notes table created");
    await client.query(createProgressTable);
    console.log("progress table created");
    await client.query(alterUsersTableAddIsVerified);
    console.log("user table altered");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  } finally {
    client.release();
  }
};
