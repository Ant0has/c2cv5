'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const MYCALC_USAGE_EVENTS = [
  'dadata.suggest.attempt',
  'dadata.suggest.success',
  'dadata.suggest.fail',
  'dadata.suggest.timeout',
  'dadata.exact.attempt',
  'dadata.exact.success',
  'dadata.exact.fail',
  'dadata.exact.timeout',
  'yandex.key1.route.attempt',
  'yandex.key1.route.success',
  'yandex.key1.route.fail',
  'yandex.key1.route.timeout',
  'yandex.key1.route.cancel',
  'yandex.key2.route.attempt',
  'yandex.key2.route.success',
  'yandex.key2.route.fail',
  'yandex.key2.route.timeout',
  'yandex.key2.route.cancel',
  'yandex.key3.route.attempt',
  'yandex.key3.route.success',
  'yandex.key3.route.fail',
  'yandex.key3.route.timeout',
  'yandex.key3.route.cancel',
  'osrm.route.attempt',
  'osrm.route.success',
  'osrm.route.fail',
  'osrm.route.timeout',
  'osrm.route.cancel',
] as const;

export type MycalcUsageEvent = (typeof MYCALC_USAGE_EVENTS)[number];
export type MycalcUsageCounters = Record<MycalcUsageEvent, number>;

export interface UseMycalcUsageResult {
  countersToday: MycalcUsageCounters;
  countersMonth: MycalcUsageCounters;
  record: (event: MycalcUsageEvent) => void;
  resetLocal: () => void;
}

type StoredDayCounters = Partial<MycalcUsageCounters>;
type StoredDays = Record<string, StoredDayCounters>;

interface StoredUsageV1 {
  version: 1;
  days: StoredDays;
}

const STORAGE_KEY = 'city2city:admin:mycalc:api-usage:v1';
const RETENTION_DAYS = 35;
const MOSCOW_TIME_ZONE = 'Europe/Moscow';
const USAGE_EVENT_SET = new Set<string>(MYCALC_USAGE_EVENTS);

const moscowDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: MOSCOW_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function getMoscowDateKey(date = new Date()): string {
  const parts = moscowDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return date.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

function isValidDateKey(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  const shiftedYear = String(shifted.getUTCFullYear()).padStart(4, '0');
  const shiftedMonth = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const shiftedDay = String(shifted.getUTCDate()).padStart(2, '0');

  return `${shiftedYear}-${shiftedMonth}-${shiftedDay}`;
}

function createEmptyCounters(): MycalcUsageCounters {
  return MYCALC_USAGE_EVENTS.reduce((counters, event) => {
    counters[event] = 0;
    return counters;
  }, {} as MycalcUsageCounters);
}

function normalizeCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.min(Math.floor(value), Number.MAX_SAFE_INTEGER);
}

function sanitizeDays(value: unknown, todayKey: string): StoredDays {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const firstRetainedDate = shiftDateKey(todayKey, -(RETENTION_DAYS - 1));
  const sanitized: StoredDays = {};

  for (const [dateKey, rawCounters] of Object.entries(value)) {
    if (
      !isValidDateKey(dateKey) ||
      dateKey < firstRetainedDate ||
      dateKey > todayKey ||
      !rawCounters ||
      typeof rawCounters !== 'object' ||
      Array.isArray(rawCounters)
    ) {
      continue;
    }

    const counters: StoredDayCounters = {};
    const source = rawCounters as Record<string, unknown>;

    for (const event of MYCALC_USAGE_EVENTS) {
      const count = normalizeCount(source[event]);
      if (count > 0) counters[event] = count;
    }

    if (Object.keys(counters).length > 0) sanitized[dateKey] = counters;
  }

  return sanitized;
}

function readStoredDays(todayKey: string): StoredDays | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Partial<StoredUsageV1>;
    if (parsed.version !== 1) return {};

    return sanitizeDays(parsed.days, todayKey);
  } catch {
    return null;
  }
}

function writeStoredDays(days: StoredDays): void {
  if (typeof window === 'undefined') return;

  const payload: StoredUsageV1 = { version: 1, days };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage may be disabled or full. The hook still keeps in-memory counts.
  }
}

function completeCounters(counters?: StoredDayCounters): MycalcUsageCounters {
  const completed = createEmptyCounters();
  if (!counters) return completed;

  for (const event of MYCALC_USAGE_EVENTS) {
    completed[event] = normalizeCount(counters[event]);
  }

  return completed;
}

function sumMonth(days: StoredDays, monthKey: string): MycalcUsageCounters {
  const total = createEmptyCounters();

  for (const [dateKey, counters] of Object.entries(days)) {
    if (!dateKey.startsWith(monthKey)) continue;

    for (const event of MYCALC_USAGE_EVENTS) {
      total[event] = Math.min(
        Number.MAX_SAFE_INTEGER,
        total[event] + normalizeCount(counters[event]),
      );
    }
  }

  return total;
}

export function useMycalcUsage(): UseMycalcUsageResult {
  const [todayKey, setTodayKey] = useState(() => getMoscowDateKey());
  const [days, setDays] = useState<StoredDays>({});
  const daysRef = useRef<StoredDays>({});

  const applyDays = useCallback((nextDays: StoredDays) => {
    daysRef.current = nextDays;
    setDays(nextDays);
  }, []);

  useEffect(() => {
    const refreshDate = () => {
      const nextTodayKey = getMoscowDateKey();
      setTodayKey((current) =>
        current === nextTodayKey ? current : nextTodayKey,
      );
    };

    const intervalId = window.setInterval(refreshDate, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const storedDays = readStoredDays(todayKey);
    if (storedDays !== null) {
      applyDays(storedDays);
      writeStoredDays(storedDays);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;

      const updatedDays = readStoredDays(getMoscowDateKey());
      if (updatedDays !== null) applyDays(updatedDays);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [applyDays, todayKey]);

  const record = useCallback(
    (event: MycalcUsageEvent) => {
      if (!USAGE_EVENT_SET.has(event)) return;

      const currentDateKey = getMoscowDateKey();
      if (currentDateKey !== todayKey) setTodayKey(currentDateKey);

      const storedDays = readStoredDays(currentDateKey);
      const baseDays = sanitizeDays(
        storedDays ?? daysRef.current,
        currentDateKey,
      );
      const dayCounters: StoredDayCounters = {
        ...(baseDays[currentDateKey] ?? {}),
      };
      const currentCount = normalizeCount(dayCounters[event]);

      dayCounters[event] = Math.min(
        Number.MAX_SAFE_INTEGER,
        currentCount + 1,
      );

      const nextDays = sanitizeDays(
        { ...baseDays, [currentDateKey]: dayCounters },
        currentDateKey,
      );

      writeStoredDays(nextDays);
      applyDays(nextDays);
    },
    [applyDays, todayKey],
  );

  const resetLocal = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Keep reset useful even when localStorage is unavailable.
    }

    applyDays({});
  }, [applyDays]);

  const countersToday = useMemo(
    () => completeCounters(days[todayKey]),
    [days, todayKey],
  );
  const countersMonth = useMemo(
    () => sumMonth(days, todayKey.slice(0, 7)),
    [days, todayKey],
  );

  return { countersToday, countersMonth, record, resetLocal };
}
