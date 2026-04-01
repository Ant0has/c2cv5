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
  };
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
          from_bound: { value: "city" },
          to_bound: { value: "settlement" },
          locations: [{ country: "Россия" }],
        }),
      });
      const data = await res.json();
      const results = (data.suggestions || [])
        .filter((s: DadataSuggestion) => s.data.geo_lat && s.data.geo_lon)
        .map((s: DadataSuggestion) => {
          const name = s.data.city || s.data.settlement || '';
          const region = s.data.region || '';
          const display = name === region ? name : (name && region ? `${name}, ${region}` : s.value);

          this.geocodeCache.set(display, {
            lat: parseFloat(s.data.geo_lat!),
            lon: parseFloat(s.data.geo_lon!),
          });

          return display;
        });
      return [...new Set(results)] as string[];
    } catch {
      return [];
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
