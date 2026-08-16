import { useCallback, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import {
  addFavoriteAsync,
  listFavoritesAsync,
  removeFavoriteAsync,
  type FavoriteAirport,
} from "@/db/favorites";
import type { Airport } from "@/lib/airports";

/**
 * Reads the favorites table into React state and re-reads it after every
 * write. SQLite is the source of truth; this state is just a snapshot of it.
 */
export function useFavorites() {
  const db = useSQLiteContext();
  const [favorites, setFavorites] = useState<FavoriteAirport[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await listFavoritesAsync(db);
    setFavorites(rows);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (airport: Airport) => {
      await addFavoriteAsync(db, airport);
      await refresh();
    },
    [db, refresh],
  );

  const remove = useCallback(
    async (icao: string) => {
      await removeFavoriteAsync(db, icao);
      await refresh();
    },
    [db, refresh],
  );

  const isFavorite = useCallback(
    (icao: string) => favorites.some((favorite) => favorite.icao === icao),
    [favorites],
  );

  return { favorites, loading, add, remove, isFavorite, refresh };
}
