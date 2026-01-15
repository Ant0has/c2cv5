import { yandexMapsService } from "@/shared/api/yandex-maps.service";
import { COEFFICIENT_100, COEFFICIENT_100_150, COEFFICIENT_150_200, COEFFICIENT_200, DEFAULT_DISTANCE, DEFAULT_PRICE, prices, SPEED } from "@/shared/constants";
import { Prices } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from 'react';

export const checkString = (str: string) => {
  const trimmed = String(str).trim();
  return trimmed === '-' ? '' : trimmed;
}

const getDeparturePoint = (point: string) => {
  if(point === 'из Белгорода' || point === 'Белгорода') return 'Белгород'
  if(point === 'из Москвы' || point === 'Москвы') return 'Москва'
  if(point === 'из Краснодара' || point === 'Краснодара') return 'Краснодар'
  if(point === 'из Екатеринбурга' || point === 'Екатеринбурга') return 'Екатеринбург'
  if(point === 'из Тюменя' || point === 'Тюменя') return 'Тюмень'
  if(point === 'из Ростова-на-Дону' || point === 'Ростова-на-Дону') return 'Ростов-на-Дону'
  if(point === 'из Казани' || point === 'Казани') return 'Казань'
  if(point === 'из Челябинска' || point === 'Челябинск') return 'Челябинск'
  if(point === 'из Уфы' || point === 'Уфы') return 'Уфа'
  if(point === 'из Самары' || point === 'Самары') return 'Самара'
  if(point === 'из Воронежа' || point === 'Воронежа') return 'Воронеж'
  if(point === 'из Нижнего-Новгорода' || point === 'Нижнего-Новгорода') return 'Нижний Новгород'
  if(point === 'из Ростов-на-Дону' || point === 'Ростов-на-Дону') return 'Ростов-на-Дону'
  if(point === 'из Казань' || point === 'Казань') return 'Казань'
  if(point === 'из Челябинск' || point === 'Челябинск') return 'Челябинск'
  if(point === 'из Уфы' || point === 'Уфы') return 'Уфа'
  if(point === 'из Самары' || point === 'Самары') return 'Самара'
  if(point === 'из Воронежа' || point === 'Воронежа') return 'Воронеж'
  if(point === 'из Нижнего-Новгорода' || point === 'Нижнего-Новгорода') return 'Нижний Новгород'
  if(point === 'из Ростов-на-Дону' || point === 'Ростов-на-Дону') return 'Ростов-на-Дону'
  if(point === 'из Казань' || point === 'Казань') return 'Казань'
  if(point === 'из Челябинск' || point === 'Челябинск') return 'Челябинск'
  if(point === 'из Уфы' || point === 'Уфы') return 'Уфа'
  if(point === 'из Самары' || point === 'Самары') return 'Самара'
  if(point === 'из Воронежа' || point === 'Воронежа') return 'Воронеж'
  if(point === 'из Нижнего-Новгорода' || point === 'Нижнего-Новгорода') return 'Нижний Новгород'
  if(point === 'из Ростов-на-Дону' || point === 'Ростов-на-Дону') return 'Ростов-на-Дону'
  if(point === 'из Казань' || point === 'Казань') return 'Казань'
  if(point === 'из Челябинск' || point === 'Челябинск') return 'Челябинск'

  return point.replace(/^Из\s+/i, '').trim()
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
  setOrderModalData: (data: any) => void;
  getRoutePanelRef: () => React.RefObject<any>;
}

export const useCalculator = ({ 
  selectedPlan, 
  cityData, 
  routeData 
}: ICalculatorProps) => {
  const routePanelRef = useRef<any>(null);

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

  const handleSearchDeparturePoint = async (value: string) => {
    const response = await yandexMapsService.getSuggestions(value);
    const uniqueData = [...new Set(response)];
    setState(prev => ({ ...prev, departurePointData: uniqueData }));
  };

  const handleChangeArrivalPoint = (value: string) => {
    setState(prev => ({ ...prev, arrivalPoint: value }));
  };

  const handleSearchArrivalPoint = async (value: string) => {
    const response = await yandexMapsService.getSuggestions(value);
    const uniqueData = [...new Set(response)];
    setState(prev => ({ ...prev, arrivalPointData: uniqueData }));
  };

  const handleCalculate = async () => {
    if (!state.departurePoint || !state.arrivalPoint) {
      message.error("Нет активной точки отправления или прибытия");
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (routePanelRef.current) {
        routePanelRef.current.routePanel.state.set({
          from: state.departurePoint,
          to: state.arrivalPoint,
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

                  console.log(distanceValue,'-----distanceValue');
                  console.log(timeValue,'-----timeValue');

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
          console.error("Error calculating route:", error);
          message.error("Ошибка расчета маршрута");
          setState(prev => ({ ...prev, isLoading: false }));
        } finally {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }, 2000);

    } catch (error) {
      console.error("Error setting route:", error);
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