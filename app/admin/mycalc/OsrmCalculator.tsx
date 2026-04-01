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
import { ChangeEvent, FC, useRef, useState, useEffect } from "react";
import s from "../calculator/Calculator.module.scss";
import { message } from "antd";

const PLAN_COEFFICIENT = "plan_coefficient";
const DADATA_API_KEY = "17364206d854a397d57b11d01e9aa93050089134";
const DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const OSRM_URL = "http://router.project-osrm.org";

interface DadataSuggestion {
  value: string;
  data: {
    geo_lat: string | null;
    geo_lon: string | null;
    city: string | null;
    settlement: string | null;
    region: string | null;
  };
}

async function suggest(query: string): Promise<{ display: string; lat: number; lon: number }[]> {
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
  return (data.suggestions || [])
    .filter((s: DadataSuggestion) => s.data.geo_lat && s.data.geo_lon)
    .map((s: DadataSuggestion) => ({
      display: s.value,
      lat: parseFloat(s.data.geo_lat!),
      lon: parseFloat(s.data.geo_lon!),
    }));
}

async function geocode(query: string): Promise<{ lat: number; lon: number; display: string }[]> {
  return suggest(query);
}

async function getRoute(
  fromLat: number, fromLon: number,
  toLat: number, toLon: number
): Promise<{ distance: number; duration: number } | null> {
  const res = await fetch(
    `${OSRM_URL}/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false`
  );
  const data = await res.json();
  if (data.routes && data.routes.length > 0) {
    return {
      distance: Math.round(data.routes[0].distance / 1000),
      duration: Math.round(data.routes[0].duration / 3600 * 2) / 2,
    };
  }
  return null;
}

const OsrmCalculator: FC = () => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [planCoefficient, setPlanCoefficient] = useState<Record<Prices, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PLAN_COEFFICIENT);
      return saved ? JSON.parse(saved) : prices;
    }
    return prices;
  });

  const [departurePoint, setDeparturePoint] = useState<string>("");
  const [departurePointData, setDeparturePointData] = useState<string[]>([]);
  const [departureCoords, setDepartureCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [arrivalPoint, setArrivalPoint] = useState<string>("");
  const [arrivalPointData, setArrivalPointData] = useState<string[]>([]);
  const [arrivalCoords, setArrivalCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [distance, setDistance] = useState<string>("-");
  const [time, setTime] = useState<string>("-");
  const [price, setPrice] = useState<number[]>();
  const [isRouteCalculating, setIsRouteCalculating] = useState(false);

  // Store geocode results for coordinate lookup
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
    const weeks = Math.floor(totalHours / (24 * 7));
    const remainingHoursAfterWeeks = totalHours % (24 * 7);
    const days = Math.floor(remainingHoursAfterWeeks / 24);
    const roundedHours = remainingHoursAfterWeeks % 24;
    const roundedMinutes = totalMinutes % 60;

    const result = [];
    if (weeks > 0) result.push(`${weeks} нед`);
    if (days > 0) result.push(`${days} дн`);
    if (roundedHours > 0) result.push(`${roundedHours} ч`);
    if (roundedMinutes > 0) result.push(`${roundedMinutes} мин`);
    return result.join(" ");
  };

  const handleCalculate = async () => {
    if (!departurePoint || !arrivalPoint) {
      alert("Заполните точки отправления и прибытия");
      return;
    }

    setIsRouteCalculating(true);

    try {
      // Geocode both points
      let fromCoords = departureCoords || geocodeCache.current.get(departurePoint);
      let toCoords = arrivalCoords || geocodeCache.current.get(arrivalPoint);

      if (!fromCoords) {
        const results = await geocode(departurePoint);
        if (results.length > 0) {
          fromCoords = { lat: results[0].lat, lon: results[0].lon };
          geocodeCache.current.set(departurePoint, fromCoords);
          setDepartureCoords(fromCoords);
        }
      }

      if (!toCoords) {
        const results = await geocode(arrivalPoint);
        if (results.length > 0) {
          toCoords = { lat: results[0].lat, lon: results[0].lon };
          geocodeCache.current.set(arrivalPoint, toCoords);
          setArrivalCoords(toCoords);
        }
      }

      if (!fromCoords || !toCoords) {
        message.error("Не удалось определить координаты городов");
        setIsRouteCalculating(false);
        return;
      }

      // Get route from OSRM
      const route = await getRoute(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);

      if (route) {
        const distanceValue = route.distance;
        const timeValue = convertHoursToRoundedTime(distanceValue / SPEED);

        setDistance(`${distanceValue} км`);
        setTime(timeValue);
        setPrice(calculatePrice(distanceValue));
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
    const tempPoint = departurePoint;
    const tempData = departurePointData;
    const tempCoords = departureCoords;

    setDeparturePoint(arrivalPoint);
    setArrivalPoint(tempPoint);
    setDeparturePointData(arrivalPointData);
    setArrivalPointData(tempData);
    setDepartureCoords(arrivalCoords);
    setArrivalCoords(tempCoords);
  };

  const debouncedGeocode = (value: string, setter: (data: string[]) => void) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) return;
    debounceRef.current = setTimeout(async () => {
      const results = await geocode(value);
      const names = results.map((r) => r.display);
      // Cache coordinates for later use
      results.forEach((r) => geocodeCache.current.set(r.display, { lat: r.lat, lon: r.lon }));
      setter([...new Set(names)]);
    }, 400);
  };

  const handleChangeDeparturePoint = (value: string) => {
    setDeparturePoint(value);
    // If selected from dropdown, set coords from cache
    const cached = geocodeCache.current.get(value);
    if (cached) setDepartureCoords(cached);
  };

  const handleSearchDeparturePoint = async (value: string) => {
    debouncedGeocode(value, setDeparturePointData);
  };

  const handleChangeArrivalPoint = (value: string) => {
    setArrivalPoint(value);
    const cached = geocodeCache.current.get(value);
    if (cached) setArrivalCoords(cached);
  };

  const handleSearchArrivalPoint = async (value: string) => {
    debouncedGeocode(value, setArrivalPointData);
  };

  const hanldeChangePlanCoefficient =
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const changedData = { ...planCoefficient, [key]: Number(val) };
      setPlanCoefficient(changedData);
      if (typeof window !== "undefined") {
        localStorage.setItem(PLAN_COEFFICIENT, JSON.stringify(changedData));
      }
    };

  useEffect(() => {
    if (distance !== "-" && !isRouteCalculating) {
      const currentDistance = parseInt(distance);
      if (!isNaN(currentDistance)) {
        setPrice(calculatePrice(currentDistance));
      }
    }
  }, [planCoefficient]);

  return (
    <div className={clsx("container", s.wrapper)}>
      <div style={{ gridColumn: "1 / -1", padding: "8px 0", marginBottom: 8, borderBottom: "2px solid #FF9C00" }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>Калькулятор</span>
        <span style={{ fontSize: 14, color: "#888", marginLeft: 12 }}>DaData + OSRM (без Яндекс.Карт)</span>
      </div>

      <div className={s.plans}>
        {plans.map((plan) => (
          <div key={plan.key} className={clsx(s.container)}>
            <div className={s.button}>{plan.label}</div>
            <input
              className={s.input}
              type="number"
              value={plan.coefficient}
              onChange={hanldeChangePlanCoefficient(plan.key)}
            />
          </div>
        ))}
        <div
          className={s.returnDefault}
          onClick={() => {
            setPlanCoefficient(prices as Record<Prices, number>);
            if (typeof window !== "undefined") {
              localStorage.setItem(PLAN_COEFFICIENT, JSON.stringify(prices));
            }
          }}
        >
          Вернуть значения по умолчанию
        </div>
      </div>

      <div className={s.block}>
        <div className={s.selection}>
          <div className={s.part}>
            <div className={clsx(s.label, "font-16-normal")}>Точка отправления</div>
            <SearchInput
              className="departure-select address-select"
              value={departurePoint}
              placeholder="Москва"
              data={departurePointData}
              handleChange={handleChangeDeparturePoint}
              handleSearch={handleSearchDeparturePoint}
            />
          </div>

          <div className={s.swapButtonWrapper}>
            <div onClick={handleClickSwapAddress} className={s.swapButton}>
              <SwapIcon />
            </div>
          </div>

          <div className={s.part}>
            <div className={clsx(s.label, "font-16-normal")}>Точка прибытия</div>
            <SearchInput
              className="arrival-select address-select"
              value={arrivalPoint}
              placeholder="Казань"
              data={arrivalPointData}
              handleChange={handleChangeArrivalPoint}
              handleSearch={handleSearchArrivalPoint}
            />
          </div>
        </div>

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
            {price ? (
              price?.map((el, id) => (
                <div className={s.priceElement} key={id}>
                  <div className={s.pricePlan}>{plans[id].label}</div>
                  <div className={s.priceValue}>{el}р</div>
                  <div className={s.pricePlan}>{plans[id].coefficient}р за км</div>
                </div>
              ))
            ) : (
              <span className="font-18-semibold">-</span>
            )}
          </div>
        </div>
      </div>

      <Button
        disabled={!departurePoint || !arrivalPoint || isRouteCalculating}
        type={ButtonTypes.PRIMARY}
        text={isRouteCalculating ? "Рассчитываю..." : "Рассчитать поездку"}
        handleClick={handleCalculate}
      />
    </div>
  );
};

export default OsrmCalculator;
