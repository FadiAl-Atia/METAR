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

// airports.json is ~7 MB keyed by ICAO. Parsed on first search, then cached.
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

// Matches ICAO, IATA, name and city, best match first.
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
      if (rank === 0) break; // exact ICAO is unique, nothing outranks it
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
