import type { PoolClient } from "pg";
import { slugify } from "../../src/utils/slug";

// Makes places browsable, like Google Arts & Culture: every place gets a web address
// (slug), a region, a category, a short summary and a cover picture.
// Existing places keep working and get a slug made from their name. Safe to run again.
export const up = async (client: PoolClient) => {
  await client.query(`
    ALTER TABLE places
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
      ADD COLUMN IF NOT EXISTS region VARCHAR(100),
      ADD COLUMN IF NOT EXISTS category VARCHAR(50),
      ADD COLUMN IF NOT EXISTS summary TEXT,
      ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS cover_image_alt VARCHAR(255),
      ADD COLUMN IF NOT EXISTS cover_image_credit TEXT;
  `);

  // Give every existing place a slug. If two places share a name, the later one
  // gets its id on the end, so no two addresses are the same.
  const places = (
    await client.query("SELECT id, name, slug FROM places ORDER BY id")
  ).rows as { id: number; name: string; slug: string | null }[];

  const taken = new Set(places.filter((p) => p.slug).map((p) => p.slug));

  for (const place of places.filter((p) => !p.slug)) {
    const base = slugify(place.name) || `place-${place.id}`;
    const slug = taken.has(base) ? `${base}-${place.id}` : base;

    taken.add(slug);
    await client.query("UPDATE places SET slug = $1 WHERE id = $2", [
      slug,
      place.id,
    ]);
  }

  // A place added by any other route (for example a seed script) that forgets a slug
  // gets "place-<id>" instead of failing.
  await client.query(`
    CREATE OR REPLACE FUNCTION places_fill_slug() RETURNS trigger AS $$
    BEGIN
      IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := 'place-' || NEW.id;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await client.query(`DROP TRIGGER IF EXISTS places_fill_slug_trg ON places;`);

  await client.query(`
    CREATE TRIGGER places_fill_slug_trg
      BEFORE INSERT ON places
      FOR EACH ROW EXECUTE FUNCTION places_fill_slug();
  `);

  await client.query(`ALTER TABLE places ALTER COLUMN slug SET NOT NULL;`);

  await client.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS places_slug_key ON places (slug);`,
  );

  await client.query(
    `CREATE INDEX IF NOT EXISTS places_region_category_idx ON places (region, category);`,
  );
};
