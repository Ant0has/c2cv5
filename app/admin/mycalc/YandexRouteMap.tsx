"use client";

import {
  FullscreenControl,
  Map,
  Placemark,
  YMaps,
  ZoomControl,
  useYMaps,
} from "@pbe/react-yandex-maps";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type ymaps from "yandex-maps";

export interface RouteCoordinates {
  lat: number;
  lon: number;
}

export interface YandexRouteSummary {
  distance: number;
  duration: number;
  points: [number, number][];
}

export interface YandexRouteResponse {
  routes: YandexRouteSummary[];
  activeRouteIndex: number;
  collectionIndexes: number[];
}

export interface YandexRouteMapHandle {
  calculateRoute: (
    from: RouteCoordinates,
    to: RouteCoordinates,
  ) => Promise<YandexRouteResponse>;
  selectRoute: (index: number) => void;
  clearRoute: () => void;
}

export type YandexRouteUsageEvent =
  | "attempt"
  | "success"
  | "fail"
  | "timeout"
  | "cancel";

export type YandexKeySlot = "key1" | "key2" | "key3";

export interface YandexRouteUsageRecord {
  event: YandexRouteUsageEvent;
  keySlot: YandexKeySlot;
}

interface TollPoint {
  lat: number;
  lon: number;
  name: string;
}

interface Props {
  avoidTrafficJams: boolean;
  onActiveRouteChange: (index: number) => void;
  onUsageEvent?: (record: YandexRouteUsageRecord) => void;
  tollPoints?: TollPoint[];
}

interface InnerProps extends Props {
  keySlot: YandexKeySlot;
}

interface MountedRoute {
  multiRoute: ymaps.multiRouter.MultiRoute;
  onRequestSend: () => void;
  onRequestSuccess: (event: object | ymaps.IEvent) => void;
  onRequestFail: (event: object | ymaps.IEvent) => void;
  onRequestCancel: () => void;
  onActiveRouteChange: () => void;
  timeoutId: ReturnType<typeof setTimeout>;
  reject: (error: Error) => void;
  hasRequestSent: boolean;
  settled: boolean;
}

const ROUTE_TIMEOUT_MS = 30_000;
const MAP_READY_TIMEOUT_MS = 8_000;

function getYandexKeyConfig(): { apiKey: string; keySlot: YandexKeySlot } {
  const apiKeys = [
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_1,
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_2,
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY_3,
  ];
  const moscowHour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date()),
  );
  const keyIndex =
    moscowHour >= 6 && moscowHour < 14
      ? 0
      : moscowHour >= 14 && moscowHour < 22
        ? 1
        : 2;
  const keySlot = (["key1", "key2", "key3"] as const)[keyIndex];

  return {
    apiKey: apiKeys.every(Boolean) ? apiKeys[keyIndex] || "" : "",
    keySlot,
  };
}

function getEventValue(event: object | ymaps.IEvent, key: string): unknown {
  return (event as ymaps.IEvent).get(key);
}

function getMetricValue(route: ymaps.IGeoObject, property: string): number {
  const metric = (route.properties as unknown as { get: (key: string) => unknown }).get(property);

  if (typeof metric === "number") return metric;
  if (metric && typeof metric === "object" && "value" in metric) {
    const value = Number((metric as { value: unknown }).value);
    return Number.isFinite(value) ? value : 0;
  }

  return 0;
}

function getRoutePoints(route: ymaps.IGeoObject): [number, number][] {
  const result: [number, number][] = [];
  const routeWithPaths = route as unknown as {
    getPaths: () => ymaps.GeoObjectCollection;
  };
  const paths = routeWithPaths.getPaths();

  for (let pathIndex = 0; pathIndex < paths.getLength(); pathIndex += 1) {
    const path = paths.get(pathIndex) as unknown as {
      geometry: { getCoordinates?: () => number[][] } | null;
    };
    const coordinates = path.geometry?.getCoordinates?.() ?? [];

    for (const coordinate of coordinates) {
      if (
        Array.isArray(coordinate) &&
        Number.isFinite(coordinate[0]) &&
        Number.isFinite(coordinate[1])
      ) {
        const point: [number, number] = [coordinate[0], coordinate[1]];
        const previous = result[result.length - 1];
        if (!previous || previous[0] !== point[0] || previous[1] !== point[1]) {
          result.push(point);
        }
      }
    }
  }

  return result;
}

function readRoutes(
  multiRoute: ymaps.multiRouter.MultiRoute,
  useTrafficDuration: boolean,
): YandexRouteResponse {
  const collection = multiRoute.getRoutes();
  const indexedRoutes: { collectionIndex: number; route: YandexRouteSummary }[] = [];

  for (let index = 0; index < collection.getLength(); index += 1) {
    const route = collection.get(index);
    const distanceMeters = getMetricValue(route, "distance");
    const durationSeconds = useTrafficDuration
      ? getMetricValue(route, "durationInTraffic") || getMetricValue(route, "duration")
      : getMetricValue(route, "duration");

    if (distanceMeters <= 0) continue;

    indexedRoutes.push({
      collectionIndex: index,
      route: {
        // Для тарифных порогов храним точное расстояние; округление — только в UI.
        distance: distanceMeters / 1000,
        duration: durationSeconds > 0 ? durationSeconds / 3600 : 0,
        points: getRoutePoints(route),
      },
    });
  }

  const activeRoute = multiRoute.getActiveRoute();
  const activeCollectionIndex = activeRoute ? collection.indexOf(activeRoute) : 0;
  const activeRouteIndex = indexedRoutes.findIndex(
    item => item.collectionIndex === activeCollectionIndex,
  );

  return {
    routes: indexedRoutes.map(item => item.route),
    activeRouteIndex: activeRouteIndex >= 0 ? activeRouteIndex : 0,
    collectionIndexes: indexedRoutes.map(item => item.collectionIndex),
  };
}

const YandexRouteMapInner = forwardRef<YandexRouteMapHandle, InnerProps>(
  ({ avoidTrafficJams, keySlot, onActiveRouteChange, onUsageEvent, tollPoints = [] }, ref) => {
    const ymapsApi = useYMaps(["multiRouter.MultiRoute"]);
    const ymapsApiRef = useRef<typeof ymaps | null>(null);
    const mapRef = useRef<ymaps.Map | null>(null);
    const mountedRouteRef = useRef<MountedRoute | null>(null);
    const calculationSequenceRef = useRef(0);
    const visibleRouteIndexesRef = useRef<number[]>([]);
    const activeRouteCallbackRef = useRef(onActiveRouteChange);
    const usageCallbackRef = useRef(onUsageEvent);

    useEffect(() => {
      ymapsApiRef.current = ymapsApi;
    }, [ymapsApi]);

    useEffect(() => {
      activeRouteCallbackRef.current = onActiveRouteChange;
    }, [onActiveRouteChange]);

    useEffect(() => {
      usageCallbackRef.current = onUsageEvent;
    }, [onUsageEvent]);

    const removeCurrentRoute = useCallback((rejectPending = true) => {
      const mounted = mountedRouteRef.current;
      if (!mounted) return;

      clearTimeout(mounted.timeoutId);
      mounted.multiRoute.model.events.remove("requestsend", mounted.onRequestSend);
      mounted.multiRoute.model.events.remove("requestsuccess", mounted.onRequestSuccess);
      mounted.multiRoute.model.events.remove("requestfail", mounted.onRequestFail);
      mounted.multiRoute.model.events.remove("requestcancel", mounted.onRequestCancel);
      mounted.multiRoute.events.remove("activeroutechange", mounted.onActiveRouteChange);

      if (!mounted.settled && rejectPending) {
        mounted.settled = true;
        if (mounted.hasRequestSent) {
          usageCallbackRef.current?.({ event: "cancel", keySlot });
        }
        mounted.reject(new Error("Предыдущий запрос маршрута отменён"));
      }

      mapRef.current?.geoObjects.remove(mounted.multiRoute);
      mounted.multiRoute.model.destroy();
      mountedRouteRef.current = null;
      visibleRouteIndexesRef.current = [];
    }, [keySlot]);

    useEffect(() => () => {
      calculationSequenceRef.current += 1;
      removeCurrentRoute();
    }, [removeCurrentRoute]);

    const waitUntilReady = useCallback(async () => {
      const startedAt = Date.now();

      while (!ymapsApiRef.current || !mapRef.current) {
        if (Date.now() - startedAt >= MAP_READY_TIMEOUT_MS) {
          throw new Error("Яндекс.Карты не успели загрузиться");
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return {
        api: ymapsApiRef.current,
        map: mapRef.current,
      };
    }, []);

    const calculateRoute = useCallback(
      async (from: RouteCoordinates, to: RouteCoordinates) => {
        const calculationSequence = calculationSequenceRef.current + 1;
        calculationSequenceRef.current = calculationSequence;
        removeCurrentRoute();

        const { api, map } = await waitUntilReady();
        if (calculationSequenceRef.current !== calculationSequence) {
          throw new Error("Запрос маршрута отменён");
        }

        return new Promise<YandexRouteResponse>((resolve, reject) => {
          const multiRoute = new api.multiRouter.MultiRoute(
            {
              referencePoints: [
                [from.lat, from.lon],
                [to.lat, to.lon],
              ],
              params: {
                routingMode: "auto",
                results: 3,
                reverseGeocoding: false,
                searchCoordOrder: "latlong",
                avoidTrafficJams,
              },
            },
            {
              activeRouteAutoSelection: true,
              boundsAutoApply: true,
              routeActiveStrokeColor: "#FF9C00",
              routeActiveStrokeWidth: 6,
              routeStrokeColor: "#4A90D9",
              routeStrokeWidth: 4,
              routeOpenBalloonOnClick: false,
              useMapMargin: true,
              zoomMargin: 40,
            },
          );
          const finishRequestListeners = () => {
            const mounted = mountedRouteRef.current;
            if (!mounted || mounted.multiRoute !== multiRoute) return;
            clearTimeout(mounted.timeoutId);
            multiRoute.model.events.remove("requestsend", mounted.onRequestSend);
            multiRoute.model.events.remove("requestsuccess", mounted.onRequestSuccess);
            multiRoute.model.events.remove("requestfail", mounted.onRequestFail);
            multiRoute.model.events.remove("requestcancel", mounted.onRequestCancel);
          };

          const onRequestSend = () => {
            const mounted = mountedRouteRef.current;
            if (!mounted || mounted.multiRoute !== multiRoute || mounted.settled) return;
            mounted.hasRequestSent = true;
            usageCallbackRef.current?.({
              event: "attempt",
              keySlot,
            });
          };

          const onRequestSuccess = () => {
            const mounted = mountedRouteRef.current;
            if (!mounted || mounted.multiRoute !== multiRoute || mounted.settled) return;

            let response: YandexRouteResponse;
            try {
              response = readRoutes(multiRoute, avoidTrafficJams);
            } catch (error) {
              mounted.settled = true;
              finishRequestListeners();
              if (mounted.hasRequestSent) {
                usageCallbackRef.current?.({ event: "fail", keySlot });
              }
              reject(error instanceof Error ? error : new Error("Не удалось прочитать маршрут Яндекса"));
              return;
            }
            if (response.routes.length === 0) {
              mounted.settled = true;
              finishRequestListeners();
              if (mounted.hasRequestSent) {
                usageCallbackRef.current?.({ event: "fail", keySlot });
              }
              reject(new Error("Яндекс не вернул маршрут с расстоянием"));
              return;
            }

            mounted.settled = true;
            finishRequestListeners();
            visibleRouteIndexesRef.current = response.collectionIndexes;
            activeRouteCallbackRef.current(response.activeRouteIndex);
            if (mounted.hasRequestSent) {
              usageCallbackRef.current?.({ event: "success", keySlot });
            }
            resolve(response);
          };

          const onRequestFail = (event: object | ymaps.IEvent) => {
            const mounted = mountedRouteRef.current;
            if (!mounted || mounted.multiRoute !== multiRoute || mounted.settled) return;

            const routeError = getEventValue(event, "error");
            mounted.settled = true;
            finishRequestListeners();
            if (mounted.hasRequestSent) {
              usageCallbackRef.current?.({ event: "fail", keySlot });
            }
            reject(routeError instanceof Error ? routeError : new Error("Ошибка Яндекс Маршрутов"));
          };

          const onRequestCancel = () => {
            const mounted = mountedRouteRef.current;
            if (!mounted || mounted.multiRoute !== multiRoute || mounted.settled) return;

            mounted.settled = true;
            finishRequestListeners();
            if (mounted.hasRequestSent) {
              usageCallbackRef.current?.({ event: "cancel", keySlot });
            }
            reject(new Error("Яндекс отменил запрос маршрута"));
          };

          const onActiveRouteChange = () => {
            const collection = multiRoute.getRoutes();
            const activeRoute = multiRoute.getActiveRoute();
            const collectionIndex = activeRoute ? collection.indexOf(activeRoute) : -1;
            const index = visibleRouteIndexesRef.current.indexOf(collectionIndex);
            if (index >= 0) activeRouteCallbackRef.current(index);
          };

          const timeoutId = setTimeout(() => {
            const mounted = mountedRouteRef.current;
            if (!mounted || mounted.multiRoute !== multiRoute || mounted.settled) return;

            mounted.settled = true;
            finishRequestListeners();
            if (mounted.hasRequestSent) {
              usageCallbackRef.current?.({ event: "timeout", keySlot });
            }
            reject(new Error("Яндекс не ответил за 30 секунд"));
          }, ROUTE_TIMEOUT_MS);

          mountedRouteRef.current = {
            multiRoute,
            onRequestSend,
            onRequestSuccess,
            onRequestFail,
            onRequestCancel,
            onActiveRouteChange,
            timeoutId,
            reject,
            hasRequestSent: false,
            settled: false,
          };

          multiRoute.model.events.add("requestsend", onRequestSend);
          multiRoute.model.events.add("requestsuccess", onRequestSuccess);
          multiRoute.model.events.add("requestfail", onRequestFail);
          multiRoute.model.events.add("requestcancel", onRequestCancel);
          multiRoute.events.add("activeroutechange", onActiveRouteChange);
          map.geoObjects.add(multiRoute);
        });
      },
      [avoidTrafficJams, keySlot, removeCurrentRoute, waitUntilReady],
    );

    useImperativeHandle(
      ref,
      () => ({
        calculateRoute,
        selectRoute: (index: number) => {
          const multiRoute = mountedRouteRef.current?.multiRoute;
          if (!multiRoute) return;
          const collectionIndex = visibleRouteIndexesRef.current[index] ?? index;
          const route = multiRoute.getRoutes().get(collectionIndex);
          if (route) {
            multiRoute.setActiveRoute(route as ymaps.multiRouter.driving.Route);
          }
        },
        clearRoute: () => {
          calculationSequenceRef.current += 1;
          removeCurrentRoute();
        },
      }),
      [calculateRoute, removeCurrentRoute],
    );

    return (
      <Map
        defaultState={{ center: [55.75, 37.62], zoom: 5, controls: [] }}
        instanceRef={(instance) => {
          mapRef.current = instance;
        }}
        options={{ suppressMapOpenBlock: true }}
        width="100%"
        height="clamp(300px, 50vh, 500px)"
      >
        <ZoomControl options={{ position: { top: 10, right: 10 } }} />
        <FullscreenControl />
        {tollPoints.map(point => (
          <Placemark
            key={`${point.lat}:${point.lon}:${point.name}`}
            geometry={[point.lat, point.lon]}
            properties={{ hintContent: point.name }}
            options={{ preset: "islands#orangeCircleDotIcon" }}
          />
        ))}
      </Map>
    );
  },
);

YandexRouteMapInner.displayName = "YandexRouteMapInner";

const YandexRouteMap = forwardRef<YandexRouteMapHandle, Props>((props, ref) => (
  <YandexRouteMapProvider ref={ref} {...props} />
));

const YandexRouteMapProvider = forwardRef<YandexRouteMapHandle, Props>((props, ref) => {
  const keyConfigRef = useRef<{ apiKey: string; keySlot: YandexKeySlot } | null>(null);
  if (!keyConfigRef.current) {
    keyConfigRef.current = getYandexKeyConfig();
  }
  const keyConfig = keyConfigRef.current;

  return (
    <YMaps
      preload
      query={{
        apikey: keyConfig.apiKey,
        lang: "ru_RU",
        coordorder: "latlong",
      }}
    >
      <YandexRouteMapInner
        ref={ref}
        {...props}
        keySlot={keyConfig.keySlot}
      />
    </YMaps>
  );
});

YandexRouteMapProvider.displayName = "YandexRouteMapProvider";

YandexRouteMap.displayName = "YandexRouteMap";

export default YandexRouteMap;
