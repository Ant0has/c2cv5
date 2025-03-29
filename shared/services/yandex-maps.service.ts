class YandexMapsService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
  private readonly SUGGEST_URL = 'https://suggest-maps.yandex.ru/suggest-geo';

  async getSuggestions(query: string): Promise<string[]> {
    try {

      const params = new URLSearchParams({
        v: '5',
        search_type: 'tp',
        part: query,
        lang: 'ru_RU',
        n: '5',
        origin: 'jsapi2Geocoder',
        bbox: '-180,-90,180,90',
        apikey: this.API_KEY || '',
      });

      const response = await fetch(`${this.SUGGEST_URL}?${params.toString()}`);
      const text = await response.text();

      const match = text.match(/^[^(]*\((.*)\)[^)]*$/);
      if (!match) {
        throw new Error('Invalid JSONP response');
      }

      const data = JSON.parse(match[1]);

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const suggestions = data[1];
      return suggestions.map((item: [string, string, string, { hl: Array<[number, number]> }]) => item[1]);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }
}

export const yandexMapsService = new YandexMapsService(); 