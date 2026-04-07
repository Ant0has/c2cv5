import { searchPOI } from "@/shared/data/custom-poi";

const DADATA_API_KEY = "17364206d854a397d57b11d01e9aa93050089134";
const DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const OSRM_URL = "https://router.project-osrm.org";

interface DadataSuggestion {
  value: string;
  data: {
    geo_lat: string | null;
    geo_lon: string | null;
    city: string | null;
    settlement: string | null;
    region: string | null;
    area: string | null;
    street: string | null;
    house: string | null;
  };
}

function formatSuggestion(s: DadataSuggestion): string {
  const city = s.data.city || s.data.settlement || '';
  const region = s.data.region || '';
  const area = s.data.area || '';
  const street = s.data.street || '';
  const house = s.data.house || '';

  if (!city) return s.value;

  const parts = [city];

  if (street) {
    parts.push(street + (house ? ' ' + house : ''));
  }

  if (city !== region) {
    if (area && area !== city && area !== region) parts.push(area + ' р-н');
    if (region) parts.push(region + ' обл');
  }

  return parts.join(', ');
}

export interface GeoResult {
  display: string;
  lat: number;
  lon: number;
}

class DadataOsrmService {
  private geocodeCache = new Map<string, { lat: number; lon: number }>();

  async getSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    // Search custom POI first (airports, borders)
    const poiResults = searchPOI(query);
    for (const poi of poiResults) {
      this.geocodeCache.set(poi.name, { lat: poi.lat, lon: poi.lon });
    }

    try {
      const res = await fetch(DADATA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${DADATA_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          count: 7,
          locations: [{ country: "Россия" }],
        }),
      });
      const data = await res.json();
      const dadataRaw = (data.suggestions || [])
        .filter((s: DadataSuggestion) => s.data.geo_lat && s.data.geo_lon);

      // Find pure city result (no street/house) — show first
      const cityResults: string[] = [];
      const otherResults: string[] = [];

      for (const s of dadataRaw) {
        const display = formatSuggestion(s);
        this.geocodeCache.set(display, {
          lat: parseFloat(s.data.geo_lat!),
          lon: parseFloat(s.data.geo_lon!),
        });
        // Pure city/settlement (no street, no house)
        if (!s.data.street && !s.data.house && (s.data.city || s.data.settlement)) {
          cityResults.push(display);
        } else {
          otherResults.push(display);
        }
      }

      // Order: [Pure city] → [POI of that city] → [Other DaData results]
      const poiNames = poiResults.map(p => p.name);
      const seen = new Set<string>();
      const combined: string[] = [];

      // 1. Pure city results first
      for (const c of cityResults) {
        if (!seen.has(c)) { combined.push(c); seen.add(c); }
      }
      // 2. POI (airports, borders) — they reference the city
      for (const p of poiNames) {
        if (!seen.has(p)) { combined.push(p); seen.add(p); }
      }
      // 3. Other DaData results (with streets/houses)
      for (const o of otherResults) {
        if (!seen.has(o)) { combined.push(o); seen.add(o); }
      }

      return combined.slice(0, 10);
    } catch {
      return poiResults.map(p => p.name);
    }
  }

  async getCoords(address: string): Promise<{ lat: number; lon: number } | null> {
    const cached = this.geocodeCache.get(address);
    if (cached) return cached;

    // Geocode via DaData
    try {
      const res = await fetch(DADATA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${DADATA_API_KEY}`,
        },
        body: JSON.stringify({
          query: address,
          count: 1,
          locations: [{ country: "Россия" }],
        }),
      });
      const data = await res.json();
      if (data.suggestions?.length > 0) {
        const s = data.suggestions[0];
        if (s.data.geo_lat && s.data.geo_lon) {
          const coords = { lat: parseFloat(s.data.geo_lat), lon: parseFloat(s.data.geo_lon) };
          this.geocodeCache.set(address, coords);
          return coords;
        }
      }
    } catch { /* silent */ }
    return null;
  }

  async getDistance(fromLat: number, fromLon: number, toLat: number, toLon: number): Promise<number | null> {
    try {
      const res = await fetch(
        `${OSRM_URL}/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false`
      );
      const data = await res.json();
      if (data.routes?.length > 0) {
        return Math.round(data.routes[0].distance / 1000);
      }
    } catch { /* silent */ }
    return null;
  }
}

export const dadataOsrmService = new DadataOsrmService();
