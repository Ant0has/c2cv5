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
      const results = (data.suggestions || [])
        .filter((s: DadataSuggestion) => s.data.geo_lat && s.data.geo_lon)
        .map((s: DadataSuggestion) => {
          const display = formatSuggestion(s);

          this.geocodeCache.set(display, {
            lat: parseFloat(s.data.geo_lat!),
            lon: parseFloat(s.data.geo_lon!),
          });

          return display;
        });
      return results as string[];
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
