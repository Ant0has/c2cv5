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
import { yandexMapsService } from "@/shared/services/yandex-maps.service";
import { ButtonTypes, Prices } from "@/shared/types/enums";
import {
  FullscreenControl,
  Map,
  RoutePanel,
  TrafficControl,
  ZoomControl,
  YMaps,
} from "@pbe/react-yandex-maps";
import clsx from "clsx";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import s from "./Calculator.module.scss";
import { message } from "antd";
import { getCurrentKey } from "@/shared/services/get-current-key";

interface IProps {
  title?: unknown;
}

const PLAN_COEFFICIENT = "plan_coefficient";

const Calculator: FC<IProps> = () => {
  const map = useRef<any>();
  const routePanelRef = useRef<any>();

  const [planCoefficient, setPlanCoefficient] = useState<
    Record<Prices, number>
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PLAN_COEFFICIENT);
      return saved ? JSON.parse(saved) : prices;
    }
    return prices;
  });

  const [departurePoint, setDeparturePoint] = useState<string>("");
  const [departurePointData, setDeparturePointData] = useState<string[]>([]);
  const [arrivalPoint, setArrivalPoint] = useState<string>("");
  const [arrivalPointData, setArrivalPointData] = useState<string[]>([]);
  const [distance, setDistance] = useState<string>("-");
  const [time, setTime] = useState<string>("-");
  const [price, setPrice] = useState<number[]>();

  const [isRouteCalculating, setIsRouteCalculating] = useState(false);

  const plans = [
    {
      key: Prices.COMFORT,
      label: planLabel[Prices.COMFORT],
      coefficient: planCoefficient[Prices.COMFORT],
    },
    {
      key: Prices.COMFORT_PLUS,
      label: planLabel[Prices.COMFORT_PLUS],
      coefficient: planCoefficient[Prices.COMFORT_PLUS],
    },
    {
      key: Prices.BUSINESS,
      label: planLabel[Prices.BUSINESS],
      coefficient: planCoefficient[Prices.BUSINESS],
    },
    {
      key: Prices.MINIVAN,
      label: planLabel[Prices.MINIVAN],
      coefficient: planCoefficient[Prices.MINIVAN],
    },
    {
      key: Prices.DELIVERY,
      label: planLabel[Prices.DELIVERY],
      coefficient: planCoefficient[Prices.DELIVERY],
    },
  ];

  const calculatePrice = (distanceValue: number) => {
    const getCoefficient = (distance: number) => {
      if (distance < 100) return COEFFICIENT_100;
      if (distance >= 100 && distance < 150) return COEFFICIENT_100_150;
      if (distance >= 150 && distance < 200) return COEFFICIENT_150_200;
      return COEFFICIENT_200;
    };

    const result = [];
    for (const key in planCoefficient) {
      if (Object.prototype.hasOwnProperty.call(planCoefficient, key)) {
        const currentPrice = planCoefficient[key as Prices];
        const initialPrice =
          distanceValue * currentPrice * getCoefficient(distanceValue);
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
      if (routePanelRef.current) {
        routePanelRef.current.routePanel.state.set({
          from: departurePoint,
          to: arrivalPoint,
        });
      }

      setTimeout(async () => {
        try {
          if (routePanelRef.current) {
            const control = await routePanelRef.current.routePanel.getRouteAsync();
            
            if (control) {
              const activeRoute = control.getActiveRoute();
              
              if (activeRoute) {
                const distance = activeRoute.properties.get("distance");
                
                if (distance?.value) {
                  const distanceValue = Math.ceil(distance.value / 1000);
                  const timeValue = convertHoursToRoundedTime(distanceValue / SPEED);
                  
                  setDistance(`${distanceValue} км`);
                  setTime(timeValue);
                  setPrice(calculatePrice(distanceValue));
                } else {
                  message.error("Не удалось получить расстояние маршрута");
                }
              } else {
                message.error("Активный маршрут не найден");
              }
            }
          }
        } catch (error) {
          console.error("Ошибка при получении данных маршрута:", error);
        } finally {
          setIsRouteCalculating(false);
        }
      }, 2000);

    } catch (error) {
      console.error("Ошибка при расчете маршрута:", error);
      setIsRouteCalculating(false);
    }
  };

  useEffect(() => {
    if (departurePoint && arrivalPoint && routePanelRef.current) {
      routePanelRef.current.routePanel.state.set({
        from: departurePoint,
        to: arrivalPoint,
      });
    }
  }, [departurePoint, arrivalPoint]);

  const handleClickSwapAddress = () => {
    const tempPoint = departurePoint;
    const tempData = departurePointData;
    
    setDeparturePoint(arrivalPoint);
    setArrivalPoint(tempPoint);
    setDeparturePointData(arrivalPointData);
    setArrivalPointData(tempData);
  };

  const handleChangeDeparturePoint = (value: string) => {
    setDeparturePoint(value);
  };

  const handleSearchDeparturePoint = async (value: string) => {
    const response = await yandexMapsService.getSuggestions(value);
    const uniqueData = [...new Set(response)];
    setDeparturePointData(uniqueData);
  };

  const handleChangeArrivalPoint = (value: string) => {
    setArrivalPoint(value);
  };

  const handleSearchArrivalPoint = async (value: string) => {
    const response = await yandexMapsService.getSuggestions(value);
    const uniqueData = [...new Set(response)];
    setArrivalPointData(uniqueData);
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
            setPlanCoefficient(prices);
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
            <div className={clsx(s.label, "font-16-normal")}>
              Точка отправления
            </div>
            <SearchInput
              className="departure-select address-select"
              value={departurePoint}
              placeholder="Санкт-Петербург"
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
            <div className={clsx(s.label, "font-16-normal")}>
              Точка прибытия
            </div>
            <SearchInput
              className="arrival-select address-select"
              value={arrivalPoint}
              placeholder="Пенза"
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
                  <div className={s.pricePlan}>
                    {plans[id].coefficient}р за км
                  </div>
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
        text={isRouteCalculating ? "Построение маршрута..." : "Рассчитать поездку"}
        handleClick={handleCalculate}
      />

      <div className={s.map}>
        <YMaps query={{ apikey: getCurrentKey() }}>
          <Map
            width={"100%"}
            height={500}
            instanceRef={map}
            defaultState={{
              center: [55.751574, 37.573856],
              zoom: 9,
              controls: [],
            }}
          >
            <ZoomControl />
            <FullscreenControl />
            <TrafficControl />
            <RoutePanel
              instanceRef={(ref: any) => {
                routePanelRef.current = ref;
                if (ref) {
                  ref.routePanel.state.set({
                    from: departurePoint || "",
                    to: arrivalPoint || "",
                  });
                  ref.routePanel.options.set({
                    visible: false,
                    float: 'none',
                    showHeader: false,
                    autoSelect: false,
                  });
                }
              }}
              options={{
                visible: false,
                float: 'none',
                showHeader: false,
              }}
            />
          </Map>
        </YMaps>
      </div>
    </div>
  );
};

export default Calculator;