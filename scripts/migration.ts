import { createTables, pool } from "../src/database/db";
import { up as addContentRelationships } from "./migrations/20261005_content_relationships";

const runMigrations = async () => {
  try {
    console.log("migration started");
    await createTables();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await addContentRelationships(client);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    console.log("migration ended");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

runMigrations();