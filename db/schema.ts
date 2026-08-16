import type { SQLiteDatabase } from "expo-sqlite";

export const DATABASE_VERSION = 1;

export async function migrateDbAsync(db: SQLiteDatabase) {
  await db.execAsync("PRAGMA journal_mode = WAL");

  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let version = row?.user_version ?? 0;

  if (version >= DATABASE_VERSION) {
    return;
  }

  // v0 -> v1: create the favorites table.
  if (version === 0) {
    await db.execAsync(`
      CREATE TABLE favorites (
        icao       TEXT PRIMARY KEY NOT NULL,
        iata       TEXT,
        name       TEXT NOT NULL,
        city       TEXT,
        country    TEXT,
        created_at INTEGER NOT NULL
      );
    `);
    version = 1;
  }

  // Future migrations go here as `if (version === 1) { ...; version = 2 }`

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
