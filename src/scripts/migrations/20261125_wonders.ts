import type { PoolClient } from "pg";

// Hidden wonders: anything worth discovering. A place, a festival, a food, a craft,
// a tradition... The map pin is optional, because not every wonder is a location.
// Safe to run more than once.
export const up = async (client: PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS wonders (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      wonder_type VARCHAR(50) NOT NULL DEFAULT 'other',
      summary TEXT,
      content TEXT,
      region VARCHAR(255),
      latitude DECIMAL(10,7),
      longitude DECIMAL(10,7),
      cover_image_url VARCHAR(500),
      cover_image_alt VARCHAR(255),
      cover_image_credit TEXT,
      video_url VARCHAR(500),
      status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // "Learn more": places on the web where people can find out more.
  await client.query(`
    CREATE TABLE IF NOT EXISTS wonder_references (
      id SERIAL PRIMARY KEY,
      wonder_id INT NOT NULL REFERENCES wonders(id) ON DELETE CASCADE,
      label VARCHAR(255) NOT NULL,
      url VARCHAR(1000) NOT NULL,
      note TEXT,
      display_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS wonders_status_type_idx
      ON wonders (status, wonder_type);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS wonder_references_wonder_idx
      ON wonder_references (wonder_id, display_order);
  `);
};