"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getLocationByContainerId } from "@/services/containers";
import { getLocationByVehicleId } from "@/services/vehicles";

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
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
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
  containerIds?: string[];
  vehicleId?: string;
}

// Create custom icons for containers and vehicle
function getContainerIcon() {
  if (!L) return undefined;
  return new L.Icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjZWYyNTI1IiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function getVehicleIcon() {
  if (!L) return undefined;
  return new L.Icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI1IiB5PSIxMSIgd2lkdGg9IjIyIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzM1NWZmIiBzdHJva2U9IiMxZTQwYWYiIHN0cm9rZS13aWR0aD0iMiIgcng9IjIiLz48Y2lyY2xlIGN4PSI4IiBjeT0iMjEiIHI9IjIuNSIgZmlsbD0iIzMzNTVmZiIgc3Ryb2tlPSIjMWU0MGFmIiBzdHJva2Utd2lkdGg9IjEiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjIxIiByPSIyLjUiIGZpbGw9IiMzMzU1ZmYiIHN0cm9rZT0iIzFlNDBhZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
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

export default function RouteMap({ polyline, height = "300px", containerIds = [], vehicleId }: RouteMapProps) {
  const [containerLocations, setContainerLocations] = useState<{ id: string; location: [number, number] }[]>([]);
  const [vehicleLocation, setVehicleLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch container and vehicle locations with normalization (detect lat/lng swap)
  useEffect(() => {
    const normalizeCoords = (coordsLike: any, reference?: [number, number][]) => {
      if (!coordsLike) return null;
      let coords: any = coordsLike;
      if (!Array.isArray(coords) && coords.location) coords = coords.location;
      if (!Array.isArray(coords) || coords.length < 2) return null;
      let a = Number(coords[0]);
      let b = Number(coords[1]);

      const inLatRange = (v: number) => v >= -90 && v <= 90;
      const inLngRange = (v: number) => v >= -180 && v <= 180;

      // If first value looks like longitude (outside lat range) but second fits lat, swap.
      if (!inLatRange(a) && inLatRange(b) && inLngRange(a)) {
        console.debug("Normalizing coords by swapping because first value out of lat range", [a, b]);
        return [b, a] as [number, number];
      }

      // If both valid and we have a route reference, pick orientation closer to route centroid
      if (reference && reference.length > 0 && inLatRange(a) && inLngRange(b)) {
        const distSq = (p: [number, number], q: [number, number]) => {
          const dx = p[0] - q[0];
          const dy = p[1] - q[1];
          return dx * dx + dy * dy;
        };
        const refCenter: [number, number] = [
          reference.reduce((s, p) => s + p[0], 0) / reference.length,
          reference.reduce((s, p) => s + p[1], 0) / reference.length,
        ];
        const asIs = distSq([a, b], refCenter);
        const swapped = distSq([b, a], refCenter);
        if (swapped < asIs) {
          console.debug("Swapping coords because swapped orientation is closer to route", { coords: [a, b], refCenter, asIs, swapped });
          return [b, a] as [number, number];
        }
      }

      return [a, b] as [number, number];
    };

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const ref = decoded && decoded.length > 0 ? decoded : undefined;

        // Fetch container locations
        if (containerIds && containerIds.length > 0) {
          const locations = await Promise.all(
            containerIds.map(async (id) => {
              try {
                const loc = await getLocationByContainerId(id);
                console.log("Raw fetched container location:", id, loc);
                const normalized = normalizeCoords(loc, ref);
                if (!normalized) return null;
                console.log("Fetched container location:", id, "location:", normalized);
                return { id, location: normalized };
              } catch (e) {
                console.error("Error fetching container", id, e);
                return null;
              }
            })
          );
          setContainerLocations(locations.filter(Boolean) as any);
        }

        // Fetch vehicle location
        if (vehicleId) {
          try {
            const loc = await getLocationByVehicleId(vehicleId);
            console.log("Raw fetched vehicle location:", loc);
            const normalized = normalizeCoords(loc, ref);
            if (normalized) {
              console.debug("Fetched vehicle location:", normalized);
              setVehicleLocation(normalized);
            } else {
              console.warn("Vehicle location could not be parsed:", loc);
            }
          } catch (e) {
            console.error("Failed to fetch vehicle location:", e);
          }
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [containerIds, vehicleId, polyline]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!decoded || decoded.length === 0) return;
    if (!L) {
      L = require("leaflet");
    }
    const map = mapRef.current;
    const bounds = L.latLngBounds(decoded as any);
    
    // Expand bounds to include container and vehicle locations
    if (containerLocations.length > 0) {
      containerLocations.forEach((c) => {
        bounds.extend(c.location);
      });
    }
    if (vehicleLocation) {
      bounds.extend(vehicleLocation);
    }

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [decoded, containerLocations, vehicleLocation]);

  if (!decoded || decoded.length === 0) {
    return <div className="text-sm text-gray-500">No route data</div>;
  }

  return (
    <div style={{ height }} className="w-full rounded overflow-hidden">
      <MapContainer 
        whenCreated={(m) => (mapRef.current = m)} 
        center={decoded[0]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Route polyline */}
        <Polyline positions={decoded} pathOptions={{ color: "#2563eb", weight: 4 }} />

        {/* Container markers */}
        {containerLocations.map((container) => (
          <Marker key={container.id} position={container.location} icon={getContainerIcon()}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-red-600">Container</p>
                <p className="text-gray-600">ID: {container.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vehicle marker */}
        {vehicleLocation && (
          <Marker position={vehicleLocation} icon={getVehicleIcon()}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-blue-600">Vehicle</p>
                <p className="text-gray-600">ID: {vehicleId}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
