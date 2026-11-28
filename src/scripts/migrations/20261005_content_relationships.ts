import type { PoolClient } from "pg";

export const up = async (client: PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS story_connections (
      id SERIAL PRIMARY KEY,
      story_id INT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      person_id INT REFERENCES people(id) ON DELETE CASCADE,
      place_id INT REFERENCES places(id) ON DELETE CASCADE,
      event_id INT REFERENCES events(id) ON DELETE CASCADE,
      artifact_id INT REFERENCES artifacts(id) ON DELETE CASCADE,
      relationship_type VARCHAR(100) NOT NULL,
      relationship_note TEXT,
      display_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT story_connections_one_target_check
        CHECK (num_nonnulls(person_id, place_id, event_id, artifact_id) = 1)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS story_connections_story_person_unique
      ON story_connections (story_id, person_id) WHERE person_id IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS story_connections_story_place_unique
      ON story_connections (story_id, place_id) WHERE place_id IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS story_connections_story_event_unique
      ON story_connections (story_id, event_id) WHERE event_id IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS story_connections_story_artifact_unique
      ON story_connections (story_id, artifact_id) WHERE artifact_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS story_connections_person_idx ON story_connections (person_id);
    CREATE INDEX IF NOT EXISTS story_connections_place_idx ON story_connections (place_id);
    CREATE INDEX IF NOT EXISTS story_connections_event_idx ON story_connections (event_id);
    CREATE INDEX IF NOT EXISTS story_connections_artifact_idx ON story_connections (artifact_id);

    CREATE TABLE IF NOT EXISTS section_people (
      section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
      person_id INT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
      display_order INT NOT NULL DEFAULT 0,
      PRIMARY KEY (section_id, person_id)
    );
    CREATE INDEX IF NOT EXISTS section_people_person_idx ON section_people (person_id);

    CREATE TABLE IF NOT EXISTS section_places (
      section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
      place_id INT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
      display_order INT NOT NULL DEFAULT 0,
      PRIMARY KEY (section_id, place_id)
    );
    CREATE INDEX IF NOT EXISTS section_places_place_idx ON section_places (place_id);

    CREATE TABLE IF NOT EXISTS event_artifacts (
      event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      artifact_id INT NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
      relationship_type VARCHAR(100),
      display_order INT NOT NULL DEFAULT 0,
      PRIMARY KEY (event_id, artifact_id)
    );
    CREATE INDEX IF NOT EXISTS event_artifacts_artifact_idx
      ON event_artifacts (artifact_id);

    ALTER TABLE source_links
      ADD COLUMN IF NOT EXISTS story_id INT REFERENCES stories(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS place_id INT REFERENCES places(id) ON DELETE CASCADE;
  `);

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'source_links_one_target_check'
          AND conrelid = 'source_links'::regclass
      ) THEN
        ALTER TABLE source_links
          ADD CONSTRAINT source_links_one_target_check
          CHECK (num_nonnulls(section_id, event_id, person_id, artifact_id, story_id, place_id) = 1)
          NOT VALID;
      END IF;
    END $$;
  `);

  await client.query(`
    ALTER TABLE source_links
      VALIDATE CONSTRAINT source_links_one_target_check;

    CREATE INDEX IF NOT EXISTS source_links_source_idx ON source_links (source_id);
    CREATE INDEX IF NOT EXISTS source_links_section_idx ON source_links (section_id);
    CREATE INDEX IF NOT EXISTS source_links_event_idx ON source_links (event_id);
    CREATE INDEX IF NOT EXISTS source_links_person_idx ON source_links (person_id);
    CREATE INDEX IF NOT EXISTS source_links_artifact_idx ON source_links (artifact_id);
    CREATE INDEX IF NOT EXISTS source_links_story_idx ON source_links (story_id);
    CREATE INDEX IF NOT EXISTS source_links_place_idx ON source_links (place_id);
  `);
};
