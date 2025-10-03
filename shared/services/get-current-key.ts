export const getCurrentKey = (): string => {
    const API_KEYS = [
        process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_1,
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_2,
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_3,
    ];
    if (!API_KEYS[0] || !API_KEYS[1] || !API_KEYS[2]) {
        return '';
    }
    const now = new Date();
    const mskTime = now.toLocaleString("en-US", { timeZone: "Europe/Moscow", hour12: false });
    const hour = parseInt(mskTime.split(' ')[1].split(':')[0]);

    if (hour >= 6 && hour < 14) return API_KEYS[0] || '';
    if (hour >= 14 && hour < 22) return API_KEYS[1] || '';
    return API_KEYS[2] || '';
  }