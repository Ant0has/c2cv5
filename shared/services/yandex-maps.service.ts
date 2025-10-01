class YandexMapsService {
  private readonly API_KEYS = [
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_1,
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_2,
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_3,
  ];
  private readonly SUGGEST_URL = 'https://suggest-maps.yandex.ru/suggest-geo';

  private getCurrentKey(): string {
    const now = new Date();
    const mskTime = now.toLocaleString("en-US", { timeZone: "Europe/Moscow", hour12: false });
    const hour = parseInt(mskTime.split(' ')[1].split(':')[0]);

    if (hour >= 6 && hour < 14) return this.API_KEYS[0] || '';
    if (hour >= 14 && hour < 22) return this.API_KEYS[1] || '';
    return this.API_KEYS[2] || ''; // 22:00–06:00
  }

  async getSuggestions(query: string): Promise<string[]> {
    try {
      const apiKey = this.getCurrentKey();
      if (!apiKey) throw new Error('No API key available');

      const params = new URLSearchParams({
        v: '5',
        search_type: 'tp',
        part: query,
        lang: 'ru_RU',
        n: '5',
        origin: 'jsapi2Geocoder',
        bbox: '-180,-90,180,90',
        apikey: apiKey,
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