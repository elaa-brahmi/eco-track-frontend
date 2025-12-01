"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import leaflet and react-leaflet components to avoid SSR "window is not defined" errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// Import leaflet only on client side
let L: any = null;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  polyline: string;
  height?: string;
}

// Lightweight polyline decoder for Google encoded polyline format
function decodePolyline(encoded: string): [number, number][] {
  if (!encoded) return [];
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += deltaLng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

export default function RouteMap({ polyline, height = "300px" }: RouteMapProps) {
  const decoded: [number, number][] = (() => {
    // Try JSON parse first (in case backend sent an array)
    try {
      const parsed = JSON.parse(polyline);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Expect [[lat,lng], ...]
        return parsed.map((p: any) => [Number(p[0]), Number(p[1])]);
      }
    } catch (e) {
      // not JSON
    }
    // Otherwise try decode encoded polyline
    try {
      return decodePolyline(polyline);
    } catch (e) {
      return [];
    }
  })();

  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!decoded || decoded.length === 0) return;
    if (!L) {
      L = require("leaflet");
    }
    const map = mapRef.current;
    const bounds = L.latLngBounds(decoded as any);
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [decoded]);

  if (!decoded || decoded.length === 0) {
    return <div className="text-sm text-gray-500">No route data</div>;
  }

  return (
    <div style={{ height }} className="w-full rounded overflow-hidden">
      <MapContainer whenCreated={(m) => (mapRef.current = m)} center={decoded[0]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={decoded} pathOptions={{ color: "#2563eb", weight: 4 }} />
      </MapContainer>
    </div>
  );
}
