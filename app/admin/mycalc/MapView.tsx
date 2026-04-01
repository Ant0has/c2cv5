"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RouteResult {
  distance: number;
  duration: number;
  geometry: string;
}

interface Props {
  routes: RouteResult[];
  selectedRoute: number;
  fromCoords: { lat: number; lon: number } | null;
  toCoords: { lat: number; lon: number } | null;
  colors: string[];
}

// Decode OSRM polyline (Google encoding)
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

export default function MapView({ routes, selectedRoute, fromCoords, toCoords, colors }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([55.75, 37.57], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old layers
    layersRef.current.forEach(l => mapRef.current!.removeLayer(l));
    layersRef.current = [];

    if (routes.length === 0) return;

    // Draw all routes (non-selected first, selected on top)
    const order = routes.map((_, i) => i).sort((a, b) => {
      if (a === selectedRoute) return 1;
      if (b === selectedRoute) return -1;
      return 0;
    });

    for (const i of order) {
      const points = decodePolyline(routes[i].geometry);
      const isSelected = i === selectedRoute;
      const polyline = L.polyline(points, {
        color: colors[i] || "#888",
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.4,
      }).addTo(mapRef.current!);
      layersRef.current.push(polyline);
    }

    // Markers
    if (fromCoords) {
      const marker = L.circleMarker([fromCoords.lat, fromCoords.lon], {
        radius: 8, fillColor: "#22c55e", fillOpacity: 1, color: "#fff", weight: 2,
      }).addTo(mapRef.current!);
      layersRef.current.push(marker);
    }

    if (toCoords) {
      const marker = L.circleMarker([toCoords.lat, toCoords.lon], {
        radius: 8, fillColor: "#ef4444", fillOpacity: 1, color: "#fff", weight: 2,
      }).addTo(mapRef.current!);
      layersRef.current.push(marker);
    }

    // Fit bounds
    const selectedPoints = decodePolyline(routes[selectedRoute].geometry);
    if (selectedPoints.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(selectedPoints), { padding: [40, 40] });
    }
  }, [routes, selectedRoute, fromCoords, toCoords, colors]);

  return <div ref={containerRef} style={{ width: "100%", height: "clamp(300px, 50vh, 500px)", borderRadius: 16, overflow: "hidden" }} />;
}
