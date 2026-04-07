"use client";

import SwapIcon from "@/public/icons/SwapIcon";
import { planLabel } from "@/pages-list/home/ui/Price/data";
import Button from "@/shared/components/ui/Button/Button";
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput";
import {
  COEFFICIENT_100,
  COEFFICIENT_100_150,
  COEFFICIENT_150_200,
  COEFFICIENT_200,
  prices,
  SPEED,
} from "@/shared/constants";
import { ButtonTypes, Prices } from "@/shared/types/enums";
import clsx from "clsx";
import { ChangeEvent, FC, useRef, useState, useEffect, useMemo } from "react";
import s from "../calculator/Calculator.module.scss";
import ms from "./mycalc.module.scss";
import { message } from "antd";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

const PLAN_COEFFICIENT = "plan_coefficient";
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

interface RouteResult {
  distance: number;
  duration: number;
  geometry: string;
}

function formatSuggestion(s: DadataSuggestion): string {
  const city = s.data.city || s.data.settlement || '';
  const region = s.data.region || '';
  const area = s.data.area || '';
  const street = s.data.street || '';
  const house = s.data.house || '';

  if (!city) return s.value;

  const parts = [city];

  // Добавить улицу и дом если есть
  if (street) {
    parts.push(street + (house ? ' ' + house : ''));
  }

  // Добавить район и область для маленьких городов
  if (city !== region) {
    if (area && area !== city && area !== region) parts.push(area + ' р-н');
    if (region) parts.push(region + ' обл');
  }

  return parts.join(', ');
}

async function suggest(query: string): Promise<{ display: string; lat: number; lon: number }[]> {
  // Search custom POI first
  const { searchPOI } = await import("@/shared/data/custom-poi");
  const poiResults = searchPOI(query).map(p => ({ display: p.name, lat: p.lat, lon: p.lon }));

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

  // Split DaData into pure cities and addresses with street/house
  const cityResults: { display: string; lat: number; lon: number }[] = [];
  const otherResults: { display: string; lat: number; lon: number }[] = [];

  for (const s of dadataRaw) {
    const item = {
      display: formatSuggestion(s),
      lat: parseFloat(s.data.geo_lat!),
      lon: parseFloat(s.data.geo_lon!),
    };
    if (!s.data.street && !s.data.house && (s.data.city || s.data.settlement)) {
      cityResults.push(item);
    } else {
      otherResults.push(item);
    }
  }

  // Order: [Pure city] → [POI of that city] → [Other DaData with addresses]
  const seen = new Set<string>();
  const combined: { display: string; lat: number; lon: number }[] = [];

  for (const c of cityResults) {
    if (!seen.has(c.display)) { combined.push(c); seen.add(c.display); }
  }
  for (const p of poiResults) {
    if (!seen.has(p.display)) { combined.push(p); seen.add(p.display); }
  }
  for (const o of otherResults) {
    if (!seen.has(o.display)) { combined.push(o); seen.add(o.display); }
  }

  return combined.slice(0, 10);
}

async function getRoutes(
  fromLat: number, fromLon: number,
  toLat: number, toLon: number
): Promise<RouteResult[]> {
  const res = await fetch(
    `${OSRM_URL}/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=polyline&alternatives=3`
  );
  const data = await res.json();
  if (data.routes && data.routes.length > 0) {
    return data.routes.map((r: { distance: number; duration: number; geometry: string }) => ({
      distance: Math.round(r.distance / 1000),
      duration: Math.round(r.duration / 3600 * 2) / 2,
      geometry: r.geometry,
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

const OsrmCalculator: FC = () => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [planCoefficient, setPlanCoefficient] = useState<Record<Prices, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PLAN_COEFFICIENT);
      return saved ? JSON.parse(saved) : prices;
    }
    return prices;
  });

  const [departurePoint, setDeparturePoint] = useState("");
  const [departurePointData, setDeparturePointData] = useState<string[]>([]);
  const [departureCoords, setDepartureCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [arrivalPoint, setArrivalPoint] = useState("");
  const [arrivalPointData, setArrivalPointData] = useState<string[]>([]);
  const [arrivalCoords, setArrivalCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [isRouteCalculating, setIsRouteCalculating] = useState(false);
  const [tollInfo, setTollInfo] = useState<{ totalCost: number; tolls: { id: string; road: string; name: string; fee: number }[] } | null>(null);

  const geocodeCache = useRef<Map<string, { lat: number; lon: number }>>(new Map());

  const plans = [
    { key: Prices.STANDARD, label: planLabel[Prices.STANDARD], coefficient: planCoefficient[Prices.STANDARD] },
    { key: Prices.COMFORT, label: planLabel[Prices.COMFORT], coefficient: planCoefficient[Prices.COMFORT] },
    { key: Prices.COMFORT_PLUS, label: planLabel[Prices.COMFORT_PLUS], coefficient: planCoefficient[Prices.COMFORT_PLUS] },
    { key: Prices.BUSINESS, label: planLabel[Prices.BUSINESS], coefficient: planCoefficient[Prices.BUSINESS] },
    { key: Prices.MINIVAN, label: planLabel[Prices.MINIVAN], coefficient: planCoefficient[Prices.MINIVAN] },
    { key: Prices.DELIVERY, label: planLabel[Prices.DELIVERY], coefficient: planCoefficient[Prices.DELIVERY] },
  ];

  const calculatePrice = (distanceValue: number) => {
    const getCoefficient = (d: number) => {
      if (d < 100) return COEFFICIENT_100;
      if (d >= 100 && d < 150) return COEFFICIENT_100_150;
      if (d >= 150 && d < 200) return COEFFICIENT_150_200;
      return COEFFICIENT_200;
    };
    const result = [];
    for (const key in planCoefficient) {
      if (Object.prototype.hasOwnProperty.call(planCoefficient, key)) {
        const currentPrice = planCoefficient[key as Prices];
        const initialPrice = distanceValue * currentPrice * getCoefficient(distanceValue);
        result.push(Math.ceil(initialPrice / 500) * 500);
      }
    }
    return result;
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
  const distance = currentRoute ? `${currentRoute.distance} км` : "-";
  const time = currentRoute ? convertHoursToRoundedTime(currentRoute.distance / SPEED) : "-";
  const price = currentRoute ? calculatePrice(currentRoute.distance) : undefined;

  // Recalculate tolls when route changes
  useEffect(() => {
    if (currentRoute?.geometry) {
      const points = decodePolyline(currentRoute.geometry);
      const result = calculateTollCost(points);
      setTollInfo(result);
    } else {
      setTollInfo(null);
    }
  }, [currentRoute]);

  const handleCalculate = async () => {
    if (!departurePoint || !arrivalPoint) {
      alert("Заполните точки отправления и прибытия");
      return;
    }

    setIsRouteCalculating(true);
    setRoutes([]);
    setSelectedRoute(0);

    try {
      let fromCoords = departureCoords || geocodeCache.current.get(departurePoint);
      let toCoords = arrivalCoords || geocodeCache.current.get(arrivalPoint);

      if (!fromCoords) {
        const results = await suggest(departurePoint);
        if (results.length > 0) {
          fromCoords = { lat: results[0].lat, lon: results[0].lon };
          geocodeCache.current.set(departurePoint, fromCoords);
          setDepartureCoords(fromCoords);
        }
      }

      if (!toCoords) {
        const results = await suggest(arrivalPoint);
        if (results.length > 0) {
          toCoords = { lat: results[0].lat, lon: results[0].lon };
          geocodeCache.current.set(arrivalPoint, toCoords);
          setArrivalCoords(toCoords);
        }
      }

      if (!fromCoords || !toCoords) {
        message.error("Не удалось определить координаты городов");
        return;
      }

      const foundRoutes = await getRoutes(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
      if (foundRoutes.length > 0) {
        setRoutes(foundRoutes);
        setSelectedRoute(0);
      } else {
        message.error("Не удалось рассчитать маршрут");
      }
    } catch {
      message.error("Ошибка расчёта маршрута");
    } finally {
      setIsRouteCalculating(false);
    }
  };

  const handleClickSwapAddress = () => {
    setDeparturePoint(arrivalPoint);
    setArrivalPoint(departurePoint);
    setDeparturePointData(arrivalPointData);
    setArrivalPointData(departurePointData);
    setDepartureCoords(arrivalCoords);
    setArrivalCoords(departureCoords);
    setRoutes([]);
  };

  const debouncedSearch = (value: string, setter: (data: string[]) => void) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) return;
    debounceRef.current = setTimeout(async () => {
      const results = await suggest(value);
      results.forEach(r => geocodeCache.current.set(r.display, { lat: r.lat, lon: r.lon }));
      setter([...new Set(results.map(r => r.display))]);
    }, 400);
  };

  const handleChangeDeparturePoint = (value: string) => {
    setDeparturePoint(value);
    const cached = geocodeCache.current.get(value);
    if (cached) setDepartureCoords(cached);
  };

  const handleChangeArrivalPoint = (value: string) => {
    setArrivalPoint(value);
    const cached = geocodeCache.current.get(value);
    if (cached) setArrivalCoords(cached);
  };

  const hanldeChangePlanCoefficient = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const changedData = { ...planCoefficient, [key]: Number(e.target.value) };
    setPlanCoefficient(changedData);
    if (typeof window !== "undefined") {
      localStorage.setItem(PLAN_COEFFICIENT, JSON.stringify(changedData));
    }
  };

  return (
    <div className={clsx("container", s.wrapper)}>
      <div style={{ gridColumn: "1 / -1", padding: "8px 0", marginBottom: 8, borderBottom: "2px solid #FF9C00", width: "100%" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Калькулятор</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>DaData + OSRM (без Яндекс.Карт)</div>
      </div>

      <div className={s.plans}>
        {plans.map((plan) => (
          <div key={plan.key} className={clsx(s.container)}>
            <div className={s.button}>{plan.label}</div>
            <input className={s.input} type="number" value={plan.coefficient} onChange={hanldeChangePlanCoefficient(plan.key)} />
          </div>
        ))}
        <div className={s.returnDefault} onClick={() => {
          setPlanCoefficient(prices as Record<Prices, number>);
          if (typeof window !== "undefined") localStorage.setItem(PLAN_COEFFICIENT, JSON.stringify(prices));
        }}>
          Вернуть значения по умолчанию
        </div>
      </div>

      <div className={s.block}>
        <div className={s.selection}>
          <div className={s.part}>
            <div className={clsx(s.label, "font-16-normal")}>Точка отправления</div>
            <SearchInput className="departure-select address-select" value={departurePoint} placeholder="Москва" data={departurePointData}
              handleChange={handleChangeDeparturePoint} handleSearch={(v: string) => debouncedSearch(v, setDeparturePointData)} />
          </div>
          <div className={s.swapButtonWrapper}>
            <div onClick={handleClickSwapAddress} className={s.swapButton}><SwapIcon /></div>
          </div>
          <div className={s.part}>
            <div className={clsx(s.label, "font-16-normal")}>Точка прибытия</div>
            <SearchInput className="arrival-select address-select" value={arrivalPoint} placeholder="Казань" data={arrivalPointData}
              handleChange={handleChangeArrivalPoint} handleSearch={(v: string) => debouncedSearch(v, setArrivalPointData)} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Button disabled={!departurePoint || !arrivalPoint || isRouteCalculating}
            type={ButtonTypes.PRIMARY} text={isRouteCalculating ? "Рассчитываю..." : "Рассчитать поездку"}
            handleClick={handleCalculate} />
        </div>

        {/* Route selector */}
        {routes.length > 1 && (
          <div className={ms.routeSelector}>
            {routes.map((r, i) => (
              <button key={i} className={clsx(ms.routeTab, { [ms.routeTabActive]: selectedRoute === i })}
                style={{ borderColor: ROUTE_COLORS[i] }} onClick={() => setSelectedRoute(i)}>
                <span className={ms.routeTabColor} style={{ background: ROUTE_COLORS[i] }} />
                <span>Маршрут {i + 1}: {r.distance} км</span>
              </button>
            ))}
          </div>
        )}

        <div className={s.info}>
          <span>Протяженность маршрута: </span>
          <span className="font-18-semibold">{distance}</span>
        </div>
        <div className={s.info}>
          <span>Примерное время в пути: </span>
          <span className="font-18-semibold">{time}</span>
        </div>
        <div className={s.info}>
          <span>Стоимость: </span>
          <div className={s.priceGrid}>
            {price ? price.map((el, id) => (
              <div className={s.priceElement} key={id}>
                <div className={s.pricePlan}>{plans[id].label}</div>
                <div className={s.priceValue}>{el}р</div>
                <div className={s.pricePlan}>{plans[id].coefficient}р за км</div>
              </div>
            )) : <span className="font-18-semibold">-</span>}
          </div>
        </div>
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
        <MapView
          routes={routes}
          selectedRoute={selectedRoute}
          fromCoords={departureCoords}
          toCoords={arrivalCoords}
          colors={ROUTE_COLORS}
          tollPoints={tollInfo?.tolls.map(t => {
            const tp = TOLL_POINTS.find(p => p.id === t.id);
            return tp ? { lat: tp.lat, lon: tp.lon, name: `${t.road} · ${t.name}` } : null;
          }).filter(Boolean) as { lat: number; lon: number; name: string }[] || []}
        />
      </div>
    </div>
  );
};

export default OsrmCalculator;
