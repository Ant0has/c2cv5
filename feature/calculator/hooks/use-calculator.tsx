import { yandexMapsService } from "@/shared/api/yandex-maps.service";
import { COEFFICIENT_100, COEFFICIENT_100_150, COEFFICIENT_150_200, COEFFICIENT_200, DEFAULT_DISTANCE, DEFAULT_PRICE, prices, SPEED } from "@/shared/constants";
import { Prices } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { message } from "antd";
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

export const checkString = (str: string) => {
  const trimmed = String(str).trim();
  return trimmed === '-' ? '' : trimmed;
}

const departureCityMap: Record<string, string> = {
  'Белгорода': 'Белгород', 'из Белгорода': 'Белгород',
  'Москвы': 'Москва', 'из Москвы': 'Москва',
  'Краснодара': 'Краснодар', 'из Краснодара': 'Краснодар',
  'Екатеринбурга': 'Екатеринбург', 'из Екатеринбурга': 'Екатеринбург',
  'Тюменя': 'Тюмень', 'из Тюменя': 'Тюмень',
  'Ростова-на-Дону': 'Ростов-на-Дону', 'из Ростова-на-Дону': 'Ростов-на-Дону', 'из Ростов-на-Дону': 'Ростов-на-Дону',
  'Казани': 'Казань', 'из Казани': 'Казань', 'Казань': 'Казань', 'из Казань': 'Казань',
  'Челябинска': 'Челябинск', 'из Челябинска': 'Челябинск', 'Челябинск': 'Челябинск', 'из Челябинск': 'Челябинск',
  'Уфы': 'Уфа', 'из Уфы': 'Уфа',
  'Самары': 'Самара', 'из Самары': 'Самара',
  'Воронежа': 'Воронеж', 'из Воронежа': 'Воронеж',
  'Нижнего-Новгорода': 'Нижний Новгород', 'из Нижнего-Новгорода': 'Нижний Новгород',
};

const getDeparturePoint = (point: string): string => {
  return departureCityMap[point] || point.replace(/^Из\s+/i, '').trim();
}

export interface ICalculatorProps {
  selectedPlan: Prices;
  cityData?: string;
  routeData?: IRouteData;
}

export interface ICalculatorState {
  departurePoint: string;
  departurePointData: string[];
  arrivalPoint: string;
  arrivalPointData: string[];
  distance: number;
  time: string;
  price: number;
  isLoading: boolean;
}

export interface ICalculatorActions {
  handleClickSwapAddress: () => void;
  handleChangeDeparturePoint: (value: string) => void;
  handleSearchDeparturePoint: (value: string) => Promise<void>;
  handleChangeArrivalPoint: (value: string) => void;
  handleSearchArrivalPoint: (value: string) => Promise<void>;
  handleCalculate: () => Promise<void>;
}

export interface IInfoDataItem {
  id: number;
  icon: string | React.ReactNode;
  value: string | number;
  valueLabel?: string;
  description: string;
}

export const useCalculator = ({ 
  selectedPlan, 
  cityData, 
  routeData 
}: ICalculatorProps) => {
  const routePanelRef = useRef<unknown>(null);

  const initialPoints = (() => {
    const pointsArray = cityData?.split(',');
    const arrivalPoint = pointsArray?.[1] || '';
    return {
      departurePoint: getDeparturePoint(pointsArray?.[0] || ''),
      arrivalPoint: arrivalPoint === '-' ? '' : arrivalPoint
    };
  })();

  const getInitialPrice = useCallback(() => {
    switch (selectedPlan) {
      case Prices.COMFORT:
        return routeData?.price_comfort || DEFAULT_PRICE;
      case Prices.COMFORT_PLUS:
        return routeData?.price_comfort_plus || DEFAULT_PRICE;
      case Prices.BUSINESS:
        return routeData?.price_business || DEFAULT_PRICE;
      case Prices.MINIVAN:
        return routeData?.price_minivan || DEFAULT_PRICE;
      case Prices.DELIVERY:
        return routeData?.price_delivery || DEFAULT_PRICE;
      default:
        return DEFAULT_PRICE;
    }
  }, [selectedPlan, routeData]);

  const getInitialDistance = useCallback(() => {
    return routeData?.distance_km || DEFAULT_DISTANCE;
  }, [routeData?.distance_km]);

  const [state, setState] = useState<ICalculatorState>({
    departurePoint: initialPoints.departurePoint,
    departurePointData: [],
    arrivalPoint: initialPoints.arrivalPoint,
    arrivalPointData: [],
    // distance: `от ${getInitialDistance()} км`,
    // time: '1 ч',
    // price: `от ${getInitialPrice()} руб.`,
    distance: getInitialDistance(),
    time: '1 ч',
    price: getInitialPrice(),
    isLoading: false,
  });

  useEffect(() => {
    setState(prev => ({
      ...prev,
      // price: `от ${getInitialPrice()} руб.`,
      // distance: `от ${getInitialDistance()} км`,
      price: getInitialPrice(),
      distance: getInitialDistance(),
    }));
  }, [getInitialPrice, getInitialDistance, selectedPlan, routeData]);

  const handleClickSwapAddress = () => {
    setState(prev => ({
      ...prev,
      departurePoint: prev.arrivalPoint,
      arrivalPoint: prev.departurePoint,
      departurePointData: prev.arrivalPointData,
      arrivalPointData: prev.departurePointData,
    }));
  };

  const handleChangeDeparturePoint = (value: string) => {
    setState(prev => ({ ...prev, departurePoint: value }));
  };

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback((value: string, setter: (data: string[]) => void) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (value.length < 2) return;
    debounceTimerRef.current = setTimeout(async () => {
      const response = await yandexMapsService.getSuggestions(value);
      setter([...new Set(response)]);
    }, 400);
  }, []);

  const handleSearchDeparturePoint = async (value: string) => {
    debouncedSearch(value, (data) => setState(prev => ({ ...prev, departurePointData: data })));
  };

  const handleChangeArrivalPoint = (value: string) => {
    setState(prev => ({ ...prev, arrivalPoint: value }));
  };

  const handleSearchArrivalPoint = async (value: string) => {
    debouncedSearch(value, (data) => setState(prev => ({ ...prev, arrivalPointData: data })));
  };

  const handleCalculate = async () => {
    if (!state.departurePoint || !state.arrivalPoint) {
      message.error("Нет активной точки отправления или прибытия");
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const panel = routePanelRef.current as { routePanel: { state: { set: (opts: Record<string, string>) => void }; getRouteAsync: () => Promise<unknown> } } | null;
      if (panel) {
        panel.routePanel.state.set({
          from: state.departurePoint,
          to: state.arrivalPoint,
        });
      }

      setTimeout(async () => {
        try {
          if (panel) {
            const control = await panel.routePanel.getRouteAsync() as { getActiveRoute: () => { properties: { get: (key: string) => { value: number } | undefined } } } | null;
            if (control) {
              const activeRoute = control.getActiveRoute();
              if (activeRoute) {
                const distance = activeRoute.properties.get("distance");
                if (distance?.value) {
                  const distanceValue = Math.ceil((distance.value / 1000) / 10) * 10;
                  
                  const convertHoursToRoundedTime = (hours: number): string => {
                    let totalMinutes = Math.ceil(hours * 60 / 30) * 30;
                    let totalHours = Math.floor(totalMinutes / 60);
                    let weeks = Math.floor(totalHours / (24 * 7));
                    let remainingHoursAfterWeeks = totalHours % (24 * 7);
                    let days = Math.floor(remainingHoursAfterWeeks / 24);
                    let roundedHours = remainingHoursAfterWeeks % 24;
                    let roundedMinutes = totalMinutes % 60;

                    let result = [];
                    if (weeks > 0) result.push(`${weeks} нед`);
                    if (days > 0) result.push(`${days} дн`);
                    if (roundedHours > 0) result.push(`${roundedHours} ч`);
                    if (roundedMinutes > 0) result.push(`${roundedMinutes} мин`);
                    return result.join(" ");
                  };

                  const getCoefficient = (distance: number) => {
                    if (distance < 100) return COEFFICIENT_100;
                    if (distance >= 100 && distance < 150) return COEFFICIENT_100_150;
                    if (distance >= 150 && distance < 200) return COEFFICIENT_150_200;
                    return COEFFICIENT_200;
                  };

                  const getPrice = () => {
                    const initialPrice = distanceValue * prices[selectedPlan as keyof typeof prices] * getCoefficient(distanceValue);
                    return Math.ceil(initialPrice / 500) * 500;
                  };

                  const timeValue = convertHoursToRoundedTime(distanceValue / SPEED);


                  setState(prev => ({
                    ...prev,
                    // distance: `${distanceValue} км`,
                    distance: distanceValue,
                    time: timeValue,
                    // price: `от ${getPrice()}р`,
                    price: getPrice(),
                    isLoading: false,
                  }));
                }
              }
            }
          }
        } catch (error) {
          message.error("Ошибка расчета маршрута");
          setState(prev => ({ ...prev, isLoading: false }));
        } finally {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }, 2000);

    } catch (error) {
      message.error("Ошибка установки маршрута");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const infoData = [
    {
      id: 1,
      icon: 'road',
      value: state.distance,
      valueLabel: `${state.distance} км`,
      description: 'Протяженность'
    },
    {
      id: 2,
      icon: 'time',
      value: state.time,
      valueLabel: state.time,
      description: 'Время в пути'
    },
    {
      id: 3,
      icon: 'wallet',
      value: state.price,
      valueLabel: `${state.price} руб.`,
      description: 'Стоимость'
    },
    {
      id: 4,
      icon:<></>,
      value:state.departurePoint,
      description: 'Точка отправления'
    },
    {
      id: 5,
      icon:<></>,
      value:state.arrivalPoint,
      description: 'Точка прибытия'
    }
  ];

  return {
    state,
    actions: {
      handleClickSwapAddress,
      handleChangeDeparturePoint,
      handleSearchDeparturePoint,
      handleChangeArrivalPoint,
      handleSearchArrivalPoint,
      handleCalculate,
    },
    infoData,
    selectedPlan,
    routeData,
    routePanelRef,
  };
};