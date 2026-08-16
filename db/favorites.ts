import type { SQLiteDatabase } from "expo-sqlite";
import type { Airport } from "@/lib/airports";

/**
 * One row of the `favorites` table. The field names match the columns exactly,
 * because expo-sqlite hands back plain objects keyed by column name.
 */
export type FavoriteAirport = {
  icao: string;
  iata: string | null;
  name: string;
  city: string | null;
  country: string | null;
  created_at: number;
};

export async function listFavoritesAsync(
  db: SQLiteDatabase,
): Promise<FavoriteAirport[]> {
  return db.getAllAsync<FavoriteAirport>(
    "SELECT icao, iata, name, city, country, created_at FROM favorites ORDER BY created_at DESC",
  );
}

/**
 * `INSERT OR IGNORE` leans on the PRIMARY KEY: adding an airport that is
 * already saved is a no-op instead of an error, so the UI never has to check
 * first.
 */
export async function addFavoriteAsync(db: SQLiteDatabase, airport: Airport) {
  await db.runAsync(
    `INSERT OR IGNORE INTO favorites (icao, iata, name, city, country, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    airport.icao,
    airport.iata || null,
    airport.name,
    airport.city || null,
    airport.country || null,
    Date.now(),
  );
}

export async function removeFavoriteAsync(db: SQLiteDatabase, icao: string) {
  await db.runAsync("DELETE FROM favorites WHERE icao = ?", icao);
}

export async function isFavoriteAsync(db: SQLiteDatabase, icao: string) {
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM favorites WHERE icao = ?",
    icao,
  );
  return (row?.count ?? 0) > 0;
}
