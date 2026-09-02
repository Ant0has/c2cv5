"use client";

import SwapIcon from "@/public/icons/SwapIcon";
import Button from "@/shared/components/ui/Button/Button";
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput";
import { ButtonTypes } from "@/shared/types/enums";
import clsx from "clsx";
import {
  ChangeEvent,
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import s from "../calculator/Calculator.module.scss";
import ms from "./mycalc.module.scss";
import { message } from "antd";
import dynamic from "next/dynamic";
import YandexRouteMap, {
  YandexRouteMapHandle,
  YandexRouteUsageRecord,
} from "./YandexRouteMap";
import {
  MycalcUsageEvent,
  useMycalcUsage,
} from "./usage-counter";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

/* ===== Локальные тарифы калькулятора (не связаны с глобальным Prices enum) ===== */
const COLOR_ORANGE = "#D97706";
const COLOR_PURPLE = "#7B61FF";
const COLOR_GREEN = "#16A34A";
const COLOR_BLACK = "#1a1a1a";

interface Tariff {
  key: string;
  label: string;
  defaultPrice: number;
  color: string;
  highlight?: boolean;
}

const TARIFFS: Tariff[] = [
  { key: "standard",       label: "Стандарт",              defaultPrice: 25, color: COLOR_ORANGE },
  { key: "standard_2026",  label: "Стандарт (2026)",       defaultPrice: 27, color: COLOR_ORANGE },
  { key: "comfort",        label: "Комфорт",               defaultPrice: 30, color: COLOR_ORANGE, highlight: true },
  { key: "comfort_sib",    label: "Комфорт (2026/Сибирь)", defaultPrice: 35, color: COLOR_ORANGE },
  { key: "comfort_plus",   label: "К+ (ДВ)",               defaultPrice: 40, color: COLOR_PURPLE },
  { key: "minivan_driver", label: "Минивэн (Водителю)",    defaultPrice: 50, color: COLOR_GREEN },
  { key: "minivan",        label: "Минивэн",               defaultPrice: 60, color: COLOR_GREEN },
  { key: "business",       label: "Бизнес класс",          defaultPrice: 80, color: COLOR_BLACK },
];

const DEFAULT_PRICES: Record<string, number> = Object.fromEntries(
  TARIFFS.map(t => [t.key, t.defaultPrice]),
);

function sanitizePlanPrices(value: unknown): Record<string, number> {
  const source = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};

  return Object.fromEntries(TARIFFS.map(tariff => {
    const candidate = Number(source[tariff.key]);
    return [
      tariff.key,
      Number.isFinite(candidate) && candidate > 0
        ? candidate
        : tariff.defaultPrice,
    ];
  }));
}

const PLAN_COEFFICIENT = "mycalc_plan_prices_v2";
const DADATA_API_KEY = "17364206d854a397d57b11d01e9aa93050089134";
const DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const OSRM_URL = "https://router.project-osrm.org";
const DADATA_TIMEOUT_MS = 8_000;
const OSRM_TIMEOUT_MS = 15_000;

// Служебная конфигурация намеренно локальна: изменение формулы клиентского
// калькулятора не должно автоматически менять расчёт на /admin/mycalc.
const SPEED = 80;
const COEFFICIENT_100 = 1.5;
const COEFFICIENT_100_150 = 1.2;
const COEFFICIENT_150_200 = 1.1;
const COEFFICIENT_200 = 1;

type RouteMode = "base" | "traffic";
type UsageRecorder = (event: MycalcUsageEvent) => void;

class RequestTimeoutError extends Error {
  constructor(service: string) {
    super(`${service} не ответил вовремя`);
    this.name = "RequestTimeoutError";
  }
}

interface DadataSuggestion {
  value: string;
  unrestricted_value?: string;
  data: {
    geo_lat: string | null;
    geo_lon: string | null;
    city: string | null;
    settlement: string | null;
    region: string | null;
    area: string | null;
    street: string | null;
    house: string | null;
    fias_id?: string | null;
    qc_geo?: number | string | null;
  };
}

interface SuggestedPoint {
  display: string;
  lat?: number;
  lon?: number;
  source: "dadata" | "poi";
  fiasId?: string;
  qcGeo?: number;
  hasHouse?: boolean;
  unrestrictedValue?: string;
  verified: boolean;
}

interface ResolvedPoint extends SuggestedPoint {
  lat: number;
  lon: number;
}

interface RouteResult {
  distance: number;
  duration: number;
  geometry: string;
  points: [number, number][];
  provider: "yandex" | "osrm";
}

function formatSuggestion(s: DadataSuggestion): string {
  // value формирует сама DaData: в нём сохраняются корпус, строение и прочие
  // уточнения, критичные для выбора правильной точки. Ручное сокращение адреса
  // может склеить разные здания в одну строку и одну запись кеша.
  return s.value.trim() || s.unrestricted_value?.trim() || "Адрес без названия";
}

function normalizeQcGeo(value: number | string | null | undefined): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : undefined;
}

function dadataSuggestionToPoint(
  suggestion: DadataSuggestion,
  verified: boolean,
  displayOverride?: string,
): SuggestedPoint {
  const lat = suggestion.data.geo_lat ? Number(suggestion.data.geo_lat) : undefined;
  const lon = suggestion.data.geo_lon ? Number(suggestion.data.geo_lon) : undefined;
  const point: SuggestedPoint = {
    display: displayOverride || formatSuggestion(suggestion),
    source: "dadata",
    fiasId: suggestion.data.fias_id || undefined,
    qcGeo: normalizeQcGeo(suggestion.data.qc_geo),
    hasHouse: Boolean(suggestion.data.house),
    unrestrictedValue: suggestion.unrestricted_value,
    verified,
  };

  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    point.lat = lat;
    point.lon = lon;
  }

  return point;
}

function hasCoordinates(point: SuggestedPoint): point is ResolvedPoint {
  return Number.isFinite(point.lat) && Number.isFinite(point.lon);
}

async function fetchJsonWithTimeout<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
  service: string,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(`${service} вернул HTTP ${response.status}`);
    return await response.json() as T;
  } catch (error) {
    if (controller.signal.aborted) throw new RequestTimeoutError(service);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeAddressIdentity(value?: string): string {
  return (value || "")
    .normalize("NFKC")
    .toLocaleLowerCase("ru-RU")
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ",")
    .trim();
}

function isSameDadataObject(
  selected: SuggestedPoint,
  exactSuggestion: DadataSuggestion,
): boolean {
  const exactFiasId = exactSuggestion.data.fias_id || undefined;
  if (selected.fiasId) return selected.fiasId === exactFiasId;

  const selectedIdentity = normalizeAddressIdentity(
    selected.unrestrictedValue || selected.display,
  );
  const exactIdentities = [
    exactSuggestion.unrestricted_value,
    exactSuggestion.value,
  ].map(normalizeAddressIdentity);

  return Boolean(selectedIdentity) && exactIdentities.includes(selectedIdentity);
}

async function suggest(
  query: string,
  recordUsage: UsageRecorder,
): Promise<SuggestedPoint[]> {
  // Search custom POI first
  const { searchPOI } = await import("@/shared/data/custom-poi");
  const poiResults: SuggestedPoint[] = searchPOI(query).map(p => ({
    display: p.name,
    lat: p.lat,
    lon: p.lon,
    source: "poi",
    verified: true,
  }));

  recordUsage("dadata.suggest.attempt");
  try {
    const data = await fetchJsonWithTimeout<{ suggestions?: DadataSuggestion[] }>(DADATA_URL, {
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
    }, DADATA_TIMEOUT_MS, "DaData");
    const dadataRaw = (data.suggestions || []) as DadataSuggestion[];

    // Split DaData into pure cities and addresses with street/house
    const cityResults: SuggestedPoint[] = [];
    const otherResults: SuggestedPoint[] = [];

    for (const s of dadataRaw) {
      const item = dadataSuggestionToPoint(s, false);
      if (!s.data.street && !s.data.house && (s.data.city || s.data.settlement)) {
        cityResults.push(item);
      } else {
        otherResults.push(item);
      }
    }

    // Order: [Pure city] → [POI of that city] → [Other DaData with addresses]
    const seen = new Set<string>();
    const combined: SuggestedPoint[] = [];

    for (const c of cityResults) {
      if (!seen.has(c.display)) { combined.push(c); seen.add(c.display); }
    }
    for (const p of poiResults) {
      if (!seen.has(p.display)) { combined.push(p); seen.add(p.display); }
    }
    for (const o of otherResults) {
      if (!seen.has(o.display)) { combined.push(o); seen.add(o.display); }
    }

    recordUsage("dadata.suggest.success");
    return combined.slice(0, 10);
  } catch (error) {
    recordUsage(
      error instanceof RequestTimeoutError
        ? "dadata.suggest.timeout"
        : "dadata.suggest.fail",
    );
    throw error;
  }
}

async function resolveDadataPoint(
  point: SuggestedPoint,
  recordUsage: UsageRecorder,
): Promise<ResolvedPoint> {
  if ((point.source === "poi" || point.verified) && hasCoordinates(point)) return point;

  recordUsage("dadata.exact.attempt");
  try {
    const data = await fetchJsonWithTimeout<{ suggestions?: DadataSuggestion[] }>(DADATA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${DADATA_API_KEY}`,
      },
      body: JSON.stringify({
        query: point.unrestrictedValue || point.display,
        count: 1,
        locations: [{ country: "Россия" }],
      }),
    }, DADATA_TIMEOUT_MS, "DaData");
    const exactSuggestion = (data.suggestions || [])[0] as DadataSuggestion | undefined;

    if (!exactSuggestion) throw new Error("DaData не вернула точные координаты");
    if (!isSameDadataObject(point, exactSuggestion)) {
      throw new Error("DaData вернула другой адрес при уточнении");
    }

    const resolved = dadataSuggestionToPoint(exactSuggestion, true, point.display);
    if (!hasCoordinates(resolved)) {
      throw new Error("DaData не вернула точные координаты");
    }

    recordUsage("dadata.exact.success");
    return resolved;
  } catch (error) {
    recordUsage(
      error instanceof RequestTimeoutError
        ? "dadata.exact.timeout"
        : "dadata.exact.fail",
    );
    throw error;
  }
}

function isApproximatePoint(point: ResolvedPoint): boolean {
  if (point.source === "poi") return false;
  if (!point.verified) return true;
  // qc_geo=0 — точные координаты дома. Значения 1–5 означают ближайший дом,
  // улицу, населённый пункт или город; для расчёта маржи это нужно показывать
  // оператору как приблизительную точку, даже если выбран только город.
  return point.qcGeo === undefined || point.qcGeo > 0;
}

function getPointQualityError(point: ResolvedPoint): string | null {
  if (point.source === "poi") return null;
  if (point.qcGeo === undefined || point.qcGeo >= 5) {
    return `Не подтверждена точность координат: ${point.display}`;
  }
  if (point.hasHouse && point.qcGeo >= 2) {
    return `Для дома DaData определила только улицу или населённый пункт: ${point.display}`;
  }
  return null;
}

async function getOsrmRoutes(
  fromLat: number, fromLon: number,
  toLat: number, toLon: number,
  signal: AbortSignal,
): Promise<RouteResult[]> {
  const res = await fetch(
    `${OSRM_URL}/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=polyline&alternatives=3`,
    { signal },
  );
  if (!res.ok) throw new Error(`OSRM вернул HTTP ${res.status}`);

  const data = await res.json();
  if (data.routes && data.routes.length > 0) {
    return data.routes.map((r: { distance: number; duration: number; geometry: string }) => ({
      distance: r.distance / 1000,
      duration: r.duration / 3600,
      geometry: r.geometry,
      points: decodePolyline(r.geometry),
      provider: "osrm" as const,
    }));
  }
  return [];
}

import { calculateTollCost, TOLL_POINTS } from "@/shared/data/toll-points";

// Decode OSRM polyline for toll calculation
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

const ROUTE_COLORS = ["#FF9C00", "#4A90D9", "#7B61FF"];

function formatDistance(distanceKm: number): string {
  // Не округляем значение через тарифный порог: 99,999 км не должно выглядеть
  // как 100 км, пока к нему применяется коэффициент диапазона < 100 км.
  const visibleDistance = Math.floor((distanceKm + Number.EPSILON) * 100) / 100;
  return visibleDistance.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

const OsrmCalculator: FC = () => {
  const {
    countersToday,
    countersMonth,
    record: recordUsage,
    resetLocal: resetLocalUsage,
  } = useMycalcUsage();
  const departureDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrivalDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const departureSearchSequenceRef = useRef(0);
  const arrivalSearchSequenceRef = useRef(0);
  const routeRequestSequenceRef = useRef(0);
  const yandexRouteMapRef = useRef<YandexRouteMapHandle | null>(null);
  const osrmAbortControllerRef = useRef<AbortController | null>(null);
  const resolvePointInFlightRef = useRef<Map<string, Promise<ResolvedPoint>>>(new Map());

  const [planCoefficient, setPlanCoefficient] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PLAN_COEFFICIENT);
      if (saved) {
        try {
          return sanitizePlanPrices(JSON.parse(saved));
        } catch {
          return DEFAULT_PRICES;
        }
      }
      return DEFAULT_PRICES;
    }
    return DEFAULT_PRICES;
  });

  const [departurePoint, setDeparturePoint] = useState("");
  const [departurePointData, setDeparturePointData] = useState<string[]>([]);
  const [departureCoords, setDepartureCoords] = useState<ResolvedPoint | null>(null);
  const [isDepartureResolving, setIsDepartureResolving] = useState(false);

  const [arrivalPoint, setArrivalPoint] = useState("");
  const [arrivalPointData, setArrivalPointData] = useState<string[]>([]);
  const [arrivalCoords, setArrivalCoords] = useState<ResolvedPoint | null>(null);
  const [isArrivalResolving, setIsArrivalResolving] = useState(false);

  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [routeMode, setRouteMode] = useState<RouteMode>("base");
  const [isRouteCalculating, setIsRouteCalculating] = useState(false);
  const [routeProvider, setRouteProvider] = useState<"yandex" | "osrm" | null>(null);
  const [routeNotice, setRouteNotice] = useState<string | null>(null);
  const [tollInfo, setTollInfo] = useState<{ totalCost: number; tolls: { id: string; road: string; name: string; fee: number }[] } | null>(null);

  const geocodeCache = useRef<Map<string, SuggestedPoint>>(new Map());

  const resolveSelectedPoint = useCallback((point: SuggestedPoint) => {
    const identity =
      point.fiasId ||
      point.unrestrictedValue ||
      point.display;
    const existingRequest = resolvePointInFlightRef.current.get(identity);
    if (existingRequest) return existingRequest;

    const request = resolveDadataPoint(point, recordUsage).finally(() => {
      if (resolvePointInFlightRef.current.get(identity) === request) {
        resolvePointInFlightRef.current.delete(identity);
      }
    });
    resolvePointInFlightRef.current.set(identity, request);
    return request;
  }, [recordUsage]);

  const plans = TARIFFS.map(t => ({
    key: t.key,
    label: t.label,
    color: t.color,
    highlight: t.highlight ?? false,
    coefficient: planCoefficient[t.key] ?? t.defaultPrice,
  }));

  const calculatePrice = (distanceValue: number) => {
    const getCoefficient = (d: number) => {
      if (d < 100) return COEFFICIENT_100;
      if (d >= 100 && d < 150) return COEFFICIENT_100_150;
      if (d >= 150 && d < 200) return COEFFICIENT_150_200;
      return COEFFICIENT_200;
    };
    // Идём строго по TARIFFS — чтобы порядок и индексы совпадали с plans[]
    // Служебный калькулятор: без округления до 500, только до целого рубля
    return TARIFFS.map(t => {
      const currentPrice = planCoefficient[t.key] ?? t.defaultPrice;
      const initialPrice = distanceValue * currentPrice * getCoefficient(distanceValue);
      return Math.round(initialPrice);
    });
  };

  const convertHoursToRoundedTime = (hours: number): string => {
    const totalMinutes = Math.ceil((hours * 60) / 30) * 30;
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const roundedHours = totalHours % 24;
    const roundedMinutes = totalMinutes % 60;
    const result = [];
    if (days > 0) result.push(`${days} дн`);
    if (roundedHours > 0) result.push(`${roundedHours} ч`);
    if (roundedMinutes > 0) result.push(`${roundedMinutes} мин`);
    return result.join(" ");
  };

  const currentRoute = routes[selectedRoute];
  const distance = currentRoute ? `${formatDistance(currentRoute.distance)} км` : "-";
  const time = currentRoute
    ? convertHoursToRoundedTime(currentRoute.duration || currentRoute.distance / SPEED)
    : "-";
  const price = currentRoute && routeProvider === "yandex"
    ? calculatePrice(currentRoute.distance)
    : undefined;

  // Recalculate tolls when route changes
  useEffect(() => {
    if (currentRoute?.points.length) {
      const result = calculateTollCost(currentRoute.points);
      setTollInfo(result);
    } else {
      setTollInfo(null);
    }
  }, [currentRoute]);

  const clearCalculatedRoute = useCallback(() => {
    routeRequestSequenceRef.current += 1;
    yandexRouteMapRef.current?.clearRoute();
    osrmAbortControllerRef.current?.abort();
    osrmAbortControllerRef.current = null;
    setRoutes([]);
    setSelectedRoute(0);
    setRouteProvider(null);
    setRouteNotice(null);
    setTollInfo(null);
    setIsRouteCalculating(false);
  }, []);

  const handleYandexUsageEvent = useCallback((usage: YandexRouteUsageRecord) => {
    recordUsage(`yandex.${usage.keySlot}.route.${usage.event}` as MycalcUsageEvent);
  }, [recordUsage]);

  const handleCalculate = async () => {
    if (!departureCoords || !arrivalCoords) {
      message.error("Выберите обе точки из подсказок DaData");
      return;
    }

    const pointQualityError =
      getPointQualityError(departureCoords) ||
      getPointQualityError(arrivalCoords);
    if (pointQualityError) {
      message.error(pointQualityError);
      return;
    }

    const requestSequence = routeRequestSequenceRef.current + 1;
    routeRequestSequenceRef.current = requestSequence;
    yandexRouteMapRef.current?.clearRoute();
    osrmAbortControllerRef.current?.abort();
    osrmAbortControllerRef.current = null;
    setIsRouteCalculating(true);
    setRoutes([]);
    setSelectedRoute(0);
    setRouteProvider(null);
    setRouteNotice(null);

    try {
      if (
        isApproximatePoint(departureCoords) ||
        isApproximatePoint(arrivalCoords)
      ) {
        message.warning("Один из адресов DaData определила приблизительно. Проверьте выбранный вариант.");
      }

      if (!yandexRouteMapRef.current) {
        throw new Error("Модуль Яндекс Маршрутов ещё не готов");
      }

      const yandexResponse = await yandexRouteMapRef.current.calculateRoute(
        departureCoords,
        arrivalCoords,
      );
      if (routeRequestSequenceRef.current !== requestSequence) return;

      const yandexRoutes: RouteResult[] = yandexResponse.routes.map(route => ({
        ...route,
        geometry: "",
        provider: "yandex",
      }));

      setRoutes(yandexRoutes);
      setSelectedRoute(Math.min(yandexResponse.activeRouteIndex, yandexRoutes.length - 1));
      setRouteProvider("yandex");
    } catch {
      if (routeRequestSequenceRef.current !== requestSequence) return;
      yandexRouteMapRef.current?.clearRoute();

      const osrmAbortController = new AbortController();
      let osrmTimedOut = false;
      const osrmTimeoutId = setTimeout(
        () => {
          osrmTimedOut = true;
          osrmAbortController.abort();
        },
        OSRM_TIMEOUT_MS,
      );
      osrmAbortControllerRef.current = osrmAbortController;
      recordUsage("osrm.route.attempt");

      try {
        const fallbackRoutes = await getOsrmRoutes(
          departureCoords.lat,
          departureCoords.lon,
          arrivalCoords.lat,
          arrivalCoords.lon,
          osrmAbortController.signal,
        );
        if (fallbackRoutes.length === 0) throw new Error("OSRM не вернул маршрут");
        recordUsage("osrm.route.success");
        if (routeRequestSequenceRef.current !== requestSequence) return;

        setRoutes(fallbackRoutes);
        setSelectedRoute(0);
        setRouteProvider("osrm");
        setRouteNotice(
          "Яндекс временно недоступен — показан резервный маршрут OSRM. Тарифные цены не рассчитаны, чтобы резервный километраж не повлиял на маржу.",
        );
        message.warning("Яндекс не ответил. Использован резервный маршрут OSRM.");
      } catch {
        recordUsage(
          osrmAbortController.signal.aborted
            ? osrmTimedOut
              ? "osrm.route.timeout"
              : "osrm.route.cancel"
            : "osrm.route.fail",
        );
        if (routeRequestSequenceRef.current === requestSequence) {
          message.error("Не удалось рассчитать маршрут ни через Яндекс, ни через резервный сервис");
        }
      } finally {
        clearTimeout(osrmTimeoutId);
        if (osrmAbortControllerRef.current === osrmAbortController) {
          osrmAbortControllerRef.current = null;
        }
      }
    } finally {
      if (routeRequestSequenceRef.current === requestSequence) {
        setIsRouteCalculating(false);
      }
    }
  };

  const handleClickSwapAddress = () => {
    departureSearchSequenceRef.current += 1;
    arrivalSearchSequenceRef.current += 1;
    setIsDepartureResolving(false);
    setIsArrivalResolving(false);
    setDeparturePoint(arrivalPoint);
    setArrivalPoint(departurePoint);
    setDeparturePointData(arrivalPointData);
    setArrivalPointData(departurePointData);
    setDepartureCoords(arrivalCoords);
    setArrivalCoords(departureCoords);
    clearCalculatedRoute();
  };

  const debouncedSearch = (
    value: string,
    setter: (data: string[]) => void,
    debounceRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
    searchSequenceRef: MutableRefObject<number>,
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const searchSequence = searchSequenceRef.current + 1;
    searchSequenceRef.current = searchSequence;

    if (value.trim().length < 2) {
      setter([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await suggest(value.trim(), recordUsage);
        if (searchSequenceRef.current !== searchSequence) return;

        results.forEach(result => {
          const cached = geocodeCache.current.get(result.display);
          if (!cached?.verified) geocodeCache.current.set(result.display, result);
        });
        setter(results.map(result => result.display));
      } catch {
        if (searchSequenceRef.current === searchSequence) setter([]);
      }
    }, 400);
  };

  const handleChangeDeparturePoint = async (value: string) => {
    if (departureDebounceRef.current) clearTimeout(departureDebounceRef.current);
    departureSearchSequenceRef.current += 1;
    const selectionSequence = departureSearchSequenceRef.current;
    setDeparturePoint(value);
    const cached = geocodeCache.current.get(value);
    setDepartureCoords(null);
    setIsDepartureResolving(false);
    clearCalculatedRoute();

    if (!cached) return;
    if (cached.verified && hasCoordinates(cached)) {
      setDepartureCoords(cached);
      return;
    }

    setIsDepartureResolving(true);
    try {
      const resolved = await resolveSelectedPoint(cached);
      if (departureSearchSequenceRef.current !== selectionSequence) return;
      geocodeCache.current.set(value, resolved);
      geocodeCache.current.set(resolved.display, resolved);
      setDepartureCoords(resolved);
    } catch {
      if (departureSearchSequenceRef.current !== selectionSequence) return;
      setDepartureCoords(null);
      message.error("DaData не смогла подтвердить выбранную точку. Выберите адрес ещё раз.");
    } finally {
      if (departureSearchSequenceRef.current === selectionSequence) {
        setIsDepartureResolving(false);
      }
    }
  };

  const handleChangeArrivalPoint = async (value: string) => {
    if (arrivalDebounceRef.current) clearTimeout(arrivalDebounceRef.current);
    arrivalSearchSequenceRef.current += 1;
    const selectionSequence = arrivalSearchSequenceRef.current;
    setArrivalPoint(value);
    const cached = geocodeCache.current.get(value);
    setArrivalCoords(null);
    setIsArrivalResolving(false);
    clearCalculatedRoute();

    if (!cached) return;
    if (cached.verified && hasCoordinates(cached)) {
      setArrivalCoords(cached);
      return;
    }

    setIsArrivalResolving(true);
    try {
      const resolved = await resolveSelectedPoint(cached);
      if (arrivalSearchSequenceRef.current !== selectionSequence) return;
      geocodeCache.current.set(value, resolved);
      geocodeCache.current.set(resolved.display, resolved);
      setArrivalCoords(resolved);
    } catch {
      if (arrivalSearchSequenceRef.current !== selectionSequence) return;
      setArrivalCoords(null);
      message.error("DaData не смогла подтвердить выбранную точку. Выберите адрес ещё раз.");
    } finally {
      if (arrivalSearchSequenceRef.current === selectionSequence) {
        setIsArrivalResolving(false);
      }
    }
  };

  const handleSearchDeparturePoint = (value: string) => {
    setDeparturePoint(value);
    setDepartureCoords(null);
    setIsDepartureResolving(false);
    clearCalculatedRoute();
    debouncedSearch(
      value,
      setDeparturePointData,
      departureDebounceRef,
      departureSearchSequenceRef,
    );
  };

  const handleSearchArrivalPoint = (value: string) => {
    setArrivalPoint(value);
    setArrivalCoords(null);
    setIsArrivalResolving(false);
    clearCalculatedRoute();
    debouncedSearch(
      value,
      setArrivalPointData,
      arrivalDebounceRef,
      arrivalSearchSequenceRef,
    );
  };

  const handleSelectRoute = (index: number) => {
    setSelectedRoute(index);
    if (routeProvider === "yandex") {
      yandexRouteMapRef.current?.selectRoute(index);
    }
  };

  useEffect(() => () => {
    routeRequestSequenceRef.current += 1;
    departureSearchSequenceRef.current += 1;
    arrivalSearchSequenceRef.current += 1;
    yandexRouteMapRef.current?.clearRoute();
    osrmAbortControllerRef.current?.abort();
    if (departureDebounceRef.current) clearTimeout(departureDebounceRef.current);
    if (arrivalDebounceRef.current) clearTimeout(arrivalDebounceRef.current);
  }, []);

  const hanldeChangePlanCoefficient = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(e.target.value);
    if (!Number.isFinite(nextValue) || nextValue <= 0) return;

    const changedData = { ...planCoefficient, [key]: nextValue };
    setPlanCoefficient(changedData);
    if (typeof window !== "undefined") {
      localStorage.setItem(PLAN_COEFFICIENT, JSON.stringify(changedData));
    }
  };

  const tollMapPoints = tollInfo?.tolls.map(toll => {
    const point = TOLL_POINTS.find(item => item.id === toll.id);
    return point
      ? { lat: point.lat, lon: point.lon, name: `${toll.road} · ${toll.name}` }
      : null;
  }).filter(Boolean) as { lat: number; lon: number; name: string }[] | undefined;
  const isPointResolving = isDepartureResolving || isArrivalResolving;
  const hasApproximateSelectedPoint = Boolean(
    (departureCoords && isApproximatePoint(departureCoords)) ||
    (arrivalCoords && isApproximatePoint(arrivalCoords)),
  );
  const addressHintText = isPointResolving
    ? "DaData уточняет координаты выбранной точки…"
    : !departureCoords || !arrivalCoords
      ? "Для точного расчёта выберите обе точки из выпадающих подсказок."
      : hasApproximateSelectedPoint
        ? "Одна из точек определена приблизительно — проверьте выбранный адрес."
        : "Обе точки выбраны: Яндекс получит координаты без повторного поиска адресов.";
  const usageRows = [
    {
      label: "DaData: подсказки",
      today: countersToday["dadata.suggest.attempt"],
      month: countersMonth["dadata.suggest.attempt"],
    },
    {
      label: "DaData: уточнение координат",
      today: countersToday["dadata.exact.attempt"],
      month: countersMonth["dadata.exact.attempt"],
    },
    ...(["key1", "key2", "key3"] as const).map((keySlot, index) => ({
      label: `Яндекс: ключ ${index + 1}, запросы`,
      today: countersToday[`yandex.${keySlot}.route.attempt`],
      month: countersMonth[`yandex.${keySlot}.route.attempt`],
    })),
    {
      label: "Яндекс: ошибки/таймауты/отмены",
      today: (["key1", "key2", "key3"] as const).reduce(
        (total, keySlot) => total +
          countersToday[`yandex.${keySlot}.route.fail`] +
          countersToday[`yandex.${keySlot}.route.timeout`] +
          countersToday[`yandex.${keySlot}.route.cancel`],
        0,
      ),
      month: (["key1", "key2", "key3"] as const).reduce(
        (total, keySlot) => total +
          countersMonth[`yandex.${keySlot}.route.fail`] +
          countersMonth[`yandex.${keySlot}.route.timeout`] +
          countersMonth[`yandex.${keySlot}.route.cancel`],
        0,
      ),
    },
    {
      label: "OSRM: резервные запросы",
      today: countersToday["osrm.route.attempt"],
      month: countersMonth["osrm.route.attempt"],
    },
  ];

  return (
    <div className={clsx("container", s.wrapper)}>
      <div style={{ gridColumn: "1 / -1", padding: "8px 0", marginBottom: 8, borderBottom: "2px solid #FF9C00", width: "100%" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Калькулятор</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
          DaData → Яндекс Карты · OSRM — резерв
        </div>
      </div>

      <details className={ms.usagePanel}>
        <summary>Примерные счётчики API (этот браузер)</summary>
        <div className={ms.usageTable}>
          <div className={ms.usageTableHeader}>Событие</div>
          <div className={ms.usageTableHeader}>Сегодня</div>
          <div className={ms.usageTableHeader}>Месяц</div>
          {usageRows.map(row => (
            <div className={ms.usageTableRow} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.today.toLocaleString("ru-RU")}</strong>
              <strong>{row.month.toLocaleString("ru-RU")}</strong>
            </div>
          ))}
        </div>
        <p className={ms.usageNote}>
          Это локальная статистика текущего браузера; при нескольких открытых вкладках
          возможна небольшая погрешность. Квота DaData остаётся общей.
          Точный общий расход Яндекса смотрите в{" "}
          <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noreferrer">
            кабинете разработчика
          </a>.
        </p>
        <button className={ms.usageReset} type="button" onClick={resetLocalUsage}>
          Сбросить локальные счётчики
        </button>
      </details>

      <details className={ms.tariffSettings}>
        <summary>Настройки тарифов (₽ за км)</summary>
        <div className={ms.tariffSettingsList}>
          {plans.map((plan) => (
            <div key={plan.key} className={ms.tariffSettingsRow}>
              <label style={{ color: plan.color, fontWeight: 600 }}>{plan.label}</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={plan.coefficient}
                onChange={hanldeChangePlanCoefficient(plan.key)}
              />
            </div>
          ))}
        </div>
        <div className={ms.tariffSettingsReset} onClick={() => {
          setPlanCoefficient(DEFAULT_PRICES);
          if (typeof window !== "undefined") localStorage.setItem(PLAN_COEFFICIENT, JSON.stringify(DEFAULT_PRICES));
        }}>
          Вернуть значения по умолчанию
        </div>
      </details>

      <div className={s.block}>
        <div className={s.selection}>
          <div className={s.part}>
            <div className={clsx(s.label, "font-16-normal", ms.mobileHidden)}>Точка отправления</div>
            <SearchInput className="departure-select address-select" value={departurePoint} placeholder="Москва" data={departurePointData}
              handleChange={handleChangeDeparturePoint} handleSearch={handleSearchDeparturePoint} />
          </div>
          <div className={s.swapButtonWrapper}>
            <div onClick={handleClickSwapAddress} className={s.swapButton}><SwapIcon /></div>
          </div>
          <div className={s.part}>
            <div className={clsx(s.label, "font-16-normal", ms.mobileHidden)}>Точка прибытия</div>
            <SearchInput className="arrival-select address-select" value={arrivalPoint} placeholder="Казань" data={arrivalPointData}
              handleChange={handleChangeArrivalPoint} handleSearch={handleSearchArrivalPoint} />
          </div>
        </div>

        <div className={clsx(ms.addressHint, {
          [ms.addressHintReady]: Boolean(
            departureCoords &&
            arrivalCoords &&
            !hasApproximateSelectedPoint &&
            !isPointResolving,
          ),
        })}>
          {addressHintText}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className={ms.routeMode}>
            <label className={clsx(ms.routeModeOption, { [ms.routeModeOptionActive]: routeMode === "base" })}>
              <input
                type="radio"
                name="mycalc-route-mode"
                value="base"
                checked={routeMode === "base"}
                onChange={() => {
                  setRouteMode("base");
                  clearCalculatedRoute();
                }}
              />
              <span>
                <strong>Базовый маршрут</strong>
                <small>без учёта текущих пробок — для стабильного сравнения</small>
              </span>
            </label>
            <label className={clsx(ms.routeModeOption, { [ms.routeModeOptionActive]: routeMode === "traffic" })}>
              <input
                type="radio"
                name="mycalc-route-mode"
                value="traffic"
                checked={routeMode === "traffic"}
                onChange={() => {
                  setRouteMode("traffic");
                  clearCalculatedRoute();
                }}
              />
              <span>
                <strong>Как в Яндекс Картах сейчас</strong>
                <small>с учётом текущей дорожной ситуации</small>
              </span>
            </label>
          </div>
          <Button disabled={!departureCoords || !arrivalCoords || isPointResolving || isRouteCalculating}
            type={ButtonTypes.PRIMARY} text={isRouteCalculating ? "Рассчитываю..." : "Рассчитать поездку"}
            handleClick={handleCalculate} />
        </div>

        {/* Route selector */}
        {routes.length > 1 && (
          <div className={ms.routeSelector}>
            {routes.map((r, i) => (
              <button key={i} className={clsx(ms.routeTab, { [ms.routeTabActive]: selectedRoute === i })}
                style={{ borderColor: ROUTE_COLORS[i] }} onClick={() => handleSelectRoute(i)}>
                <span className={ms.routeTabColor} style={{ background: ROUTE_COLORS[i] }} />
                <span>Маршрут {i + 1}: {formatDistance(r.distance)} км</span>
              </button>
            ))}
          </div>
        )}

        {routeProvider && (
          <div className={clsx(ms.routeSource, {
            [ms.routeSourceYandex]: routeProvider === "yandex",
            [ms.routeSourceFallback]: routeProvider === "osrm",
          })}>
            Источник километража: {routeProvider === "yandex"
              ? `Яндекс Карты (${routeMode === "traffic" ? "с пробками" : "без пробок"})`
              : "OSRM (резерв)"}
          </div>
        )}

        {routeNotice && <div className={ms.routeNotice}>{routeNotice}</div>}

        <div className={s.info}>
          <span>Протяженность маршрута: </span>
          <span className="font-18-semibold">{distance}</span>
        </div>
        <div className={s.info}>
          <span>Примерное время в пути: </span>
          <span className="font-18-semibold">{time}</span>
        </div>
        {price ? (
          <div className={ms.resultsList}>
            {price.map((el, id) => (
              <div
                key={id}
                className={clsx(
                  ms.resultsRow,
                  id % 2 === 0 ? ms.resultsRowBold : ms.resultsRowNormal,
                  plans[id].highlight && ms.resultsRowHighlight,
                )}
              >
                <span className={ms.resultsLabel} style={{ color: plans[id].color }}>
                  {plans[id].label}
                </span>
                <span className={ms.resultsPerKm}>{plans[id].coefficient}₽/км</span>
                <span className={ms.resultsPrice}>{el.toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
          </div>
        ) : null}
        {/* Toll roads */}
        {tollInfo && tollInfo.tolls.length > 0 && (
          <div style={{ margin: '20px 0', padding: 16, background: '#fff3e0', borderRadius: 12, border: '1px solid #ffcc80' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              Платные дороги: {tollInfo.totalCost}₽
            </div>
            {tollInfo.tolls.map(t => (
              <div key={t.id} style={{ fontSize: 14, color: '#555', padding: '2px 0' }}>
                {t.road} · {t.name}: {t.fee}₽
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className={s.map}>
        <div style={{ display: routeProvider === "osrm" ? "none" : "block" }}>
          <YandexRouteMap
            ref={yandexRouteMapRef}
            avoidTrafficJams={routeMode === "traffic"}
            onActiveRouteChange={setSelectedRoute}
            onUsageEvent={handleYandexUsageEvent}
            tollPoints={tollMapPoints || []}
          />
        </div>
        {routeProvider === "osrm" && (
          <MapView
            routes={routes}
            selectedRoute={selectedRoute}
            fromCoords={departureCoords}
            toCoords={arrivalCoords}
            colors={ROUTE_COLORS}
            tollPoints={tollMapPoints || []}
          />
        )}
      </div>
    </div>
  );
};

export default OsrmCalculator;
