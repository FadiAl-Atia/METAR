export type Airport = {
  icao: string;
  iata: string;
  name: string;
  city: string;
  state: string;
  country: string;
  elevation: number;
  lat: number;
  lon: number;
  tz: string;
};

/**
 * airports.json is ~7 MB keyed by ICAO. We only turn it into an array once,
 * the first time somebody actually searches, and keep it in module scope after
 * that so the cost is never paid twice.
 */
let cache: Airport[] | null = null;

function allAirports(): Airport[] {
  if (!cache) {
    const byIcao: Record<string, Airport> = require("@/assets/data/airports.json");
    cache = Object.values(byIcao);
  }
  return cache;
}

export function findAirport(icao: string): Airport | undefined {
  const needle = icao.trim().toUpperCase();
  return allAirports().find((airport) => airport.icao === needle);
}

/**
 * Matches on ICAO, IATA, airport name and city. Results are ordered so the
 * most literal match (an exact ICAO) comes first.
 */
export function searchAirports(query: string, limit = 20): Airport[] {
  const needle = query.trim().toUpperCase();
  if (needle.length < 2) {
    return [];
  }

  const results: { airport: Airport; rank: number }[] = [];

  for (const airport of allAirports()) {
    const rank = rankAirport(airport, needle);
    if (rank !== null) {
      results.push({ airport, rank });
      // An exact ICAO hit is unique, nothing can outrank it.
      if (rank === 0) break;
    }
  }

  return results
    .sort((a, b) => a.rank - b.rank || a.airport.icao.localeCompare(b.airport.icao))
    .slice(0, limit)
    .map((result) => result.airport);
}

function rankAirport(airport: Airport, needle: string): number | null {
  if (airport.icao === needle) return 0;
  if (airport.icao.startsWith(needle)) return 1;
  if (airport.iata && airport.iata === needle) return 2;
  if (airport.name.toUpperCase().startsWith(needle)) return 3;
  if (airport.city && airport.city.toUpperCase().startsWith(needle)) return 4;
  if (airport.name.toUpperCase().includes(needle)) return 5;
  return null;
}
