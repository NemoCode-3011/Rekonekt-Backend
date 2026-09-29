import { createTables, pool } from "../src/database/db";
const runMigrations = async () => {
  console.log("migration started");
  await createTables();
  await pool.end();
  console.log("migration ended");
};
runMigrations();