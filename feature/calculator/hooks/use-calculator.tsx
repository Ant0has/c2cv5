import { dadataOsrmService } from "@/shared/api/dadata-osrm.service";
import { DEFAULT_DISTANCE, SPEED } from "@/shared/constants";
import { calculatePublicQuote, formatPublicPrice, publicMinimum } from '../public-price';
import { Prices } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { message } from "antd";
import { useCallback, useEffect, useState } from 'react';

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
    // Saved page prices already include any publication discount. Never subtract it twice.
    const fallback = publicMinimum(selectedPlan);
    switch (selectedPlan) {
      case Prices.COMFORT:
        return routeData?.price_comfort || fallback;
      case Prices.COMFORT_PLUS:
        return routeData?.price_comfort_plus || fallback;
      case Prices.BUSINESS:
        return routeData?.price_business || fallback;
      case Prices.MINIVAN:
        return routeData?.price_minivan || fallback;
      case Prices.DELIVERY:
        return routeData?.price_delivery || fallback;
      default:
        return fallback;
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

  const contextKey = JSON.stringify([cityData, routeData?.ID, routeData?.url]);
  const [lastCalculation, setLastCalculation] = useState<{
    distanceKm: number; time: string; contextKey: string;
  } | null>(null);
  const currentCalculation = lastCalculation?.contextKey === contextKey ? lastCalculation : null;
  // Changing class re-prices the same calculated trip without a new routing request.
  const displayState: ICalculatorState = currentCalculation ? {
    ...state,
    distance: Math.ceil(currentCalculation.distanceKm / 10) * 10,
    time: currentCalculation.time,
    price: calculatePublicQuote(currentCalculation.distanceKm, selectedPlan).price,
  } : { ...state, price: getInitialPrice() };

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

  const handleSearchDeparturePoint = async (value: string) => {
    if (value.length < 2) return;
    const response = await dadataOsrmService.getSuggestions(value);
    setState(prev => ({ ...prev, departurePointData: response }));
  };

  const handleChangeArrivalPoint = (value: string) => {
    setState(prev => ({ ...prev, arrivalPoint: value }));
  };

  const handleSearchArrivalPoint = async (value: string) => {
    if (value.length < 2) return;
    const response = await dadataOsrmService.getSuggestions(value);
    setState(prev => ({ ...prev, arrivalPointData: response }));
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

      const timeValue = convertHoursToRoundedTime(distanceValue / SPEED);

      setLastCalculation({ distanceKm, time: timeValue, contextKey });

      setState(prev => ({
        ...prev,
        distance: distanceValue,
        time: timeValue,
        price: calculatePublicQuote(distanceKm, selectedPlan).price,
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
      value: displayState.distance,
      valueLabel: `${displayState.distance} км`,
      description: 'Протяженность'
    },
    {
      id: 2,
      icon: 'time',
      value: displayState.time,
      valueLabel: displayState.time,
      description: 'Время в пути'
    },
    {
      id: 3,
      icon: 'wallet',
      value: displayState.price,
      valueLabel: formatPublicPrice(displayState.price),
      description: 'Предварительная стоимость'
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
    state: displayState,
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
