import { dadataOsrmService } from "@/shared/api/dadata-osrm.service";
import { COEFFICIENT_100, COEFFICIENT_100_150, COEFFICIENT_150_200, COEFFICIENT_200, DEFAULT_DISTANCE, DEFAULT_PRICE, prices, SPEED } from "@/shared/constants";
import { Prices } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from 'react';

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
      const response = await dadataOsrmService.getSuggestions(value);
      setter(response);
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
      const fromCoords = await dadataOsrmService.getCoords(state.departurePoint);
      const toCoords = await dadataOsrmService.getCoords(state.arrivalPoint);

      if (!fromCoords || !toCoords) {
        message.error("Не удалось определить координаты");
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const distanceKm = await dadataOsrmService.getDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);

      if (!distanceKm) {
        message.error("Не удалось рассчитать маршрут");
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const distanceValue = Math.ceil(distanceKm / 10) * 10;

      const convertHoursToRoundedTime = (hours: number): string => {
        const totalMinutes = Math.ceil(hours * 60 / 30) * 30;
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

      const getCoefficient = (d: number) => {
        if (d < 100) return COEFFICIENT_100;
        if (d >= 100 && d < 150) return COEFFICIENT_100_150;
        if (d >= 150 && d < 200) return COEFFICIENT_150_200;
        return COEFFICIENT_200;
      };

      const getPrice = () => {
        const initialPrice = distanceValue * prices[selectedPlan as keyof typeof prices] * getCoefficient(distanceValue);
        return Math.ceil(initialPrice / 500) * 500;
      };

      const timeValue = convertHoursToRoundedTime(distanceValue / SPEED);

      setState(prev => ({
        ...prev,
        distance: distanceValue,
        time: timeValue,
        price: getPrice(),
        isLoading: false,
      }));
    } catch {
      message.error("Ошибка расчёта маршрута");
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
  };
};