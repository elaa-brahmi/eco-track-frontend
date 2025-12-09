"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchBins } from "@/services/containers";
import { BinData } from "@/types/BinData";
import { RouteWithTaskDto } from "@/types/RouteWithTaskDto";
import { getActiveRoutes } from "@/services/route";
import { getAllVehicles } from "@/services/vehicles";
import { Vehicle } from "@/types/vehicle";

const greenIcon = new L.Icon({
  iconUrl: "/green-bin.png",
  iconSize: [35, 45],
});

const redIcon = new L.Icon({
  iconUrl: "/red-bin.png",
  iconSize: [65, 45],
});

const truckSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230256db'><rect x='1' y='7' width='14' height='7' rx='1.5'/><rect x='15' y='9' width='6' height='5' rx='1'/><circle cx='6.5' cy='16.5' r='1.5' fill='%231e40af'/><circle cx='17.5' cy='16.5' r='1.5' fill='%231e40af'/></svg>`;
const truckIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(truckSvg)}`,
  iconSize: [75, 70],
  iconAnchor: [15, 12],
  popupAnchor: [0, -12],
});

export default function BinsMapLeaflet() {
  const [bins, setBins] = useState<BinData[]>([]);
  const [activeRoutes, setActiveRoutes] = useState<RouteWithTaskDto[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);

  const mapRef = useRef<any>(null);
  const hoverPopupRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      setBins(await fetchBins());
      setActiveRoutes(await getActiveRoutes());
      console.log("Active Routes:", await getActiveRoutes());
      setVehicles(await getAllVehicles());
    }
    load();
  }, []);

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

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    };
    window.addEventListener("sidebar-toggle", handleResize);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("sidebar-toggle", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] relative">
      <MapContainer
        center={[34.7400, 10.7600]}
        zoom={12}
        whenCreated={(m) => (mapRef.current = m)}
        className="leaflet-container"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* BIN MARKERS */}
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            position={bin.location}
            icon={bin.fillLevel > 75 ? redIcon : greenIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">Bin Details</h3>
                <p><strong>ID:</strong> {bin.id}</p>
                <p><strong>Fill Level:</strong> {bin.fillLevel}%</p>
                <p><strong>Type:</strong> {bin.type}</p>
                <p><strong>Status:</strong> {bin.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* ROUTES */}
        {activeRoutes.map((route, idx) => {
          const decoded = decodePolyline(route.polyline || "");
          if (!decoded.length) return null;

          const color = idx % 2 === 0 ? "#2563eb" : "#10b981";

          const formattedDistance = route.totalDistanceKm
            ? Number(route.totalDistanceKm).toFixed(1)
            : "N/A";

          const durMin = route.totalDurationMin ?? 0;
          const hrs = Math.floor(durMin / 60);
          const mins = Math.round(durMin % 60);
          const formattedDuration = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

          return (
            <Polyline
              key={route.routeId}
              positions={decoded}
              pathOptions={{
                color,
                weight: hoveredRouteId === route.routeId ? 7 : 4,
                opacity: hoveredRouteId === route.routeId ? 1 : 0.9,
                interactive: true, // <-- MUST be true for clicks to work
              }}
              eventHandlers={{
                mouseover: (e: any) => {
                  setHoveredRouteId(route.routeId);
                  const map = mapRef.current;
                  if (!map) return;
                  const latlng = e?.latlng || { lat: decoded[0][0], lng: decoded[0][1] };
                  if (!latlng) return;
                  if (hoverPopupRef.current) {
                    try { map.closePopup(hoverPopupRef.current); } catch {}
                  }
                  const popup = L.popup({ offset: [0, -10], closeButton: false, autoClose: false })
                    .setLatLng(latlng)
                    .setContent(`<div class="text-sm font-medium">Route: ${route.routeId}</div>`)
                    .openOn(map);
                  hoverPopupRef.current = popup;
                },
                mouseout: () => {
                  setHoveredRouteId(null);
                  const map = mapRef.current;
                  if (!map) return;
                  if (hoverPopupRef.current) {
                    try { map.closePopup(hoverPopupRef.current); } catch {}
                    hoverPopupRef.current = null;
                  }
                },
                click: (e: any) => {
                  const map = mapRef.current;
                  if (!map) return;
                  const latlng = e?.latlng || { lat: decoded[0][0], lng: decoded[0][1] };
                  if (!latlng) return;
                  const html = `
                    <div class="text-sm">
                      <div class="font-medium">Route: ${route.routeId}</div>
                      <div class="text-xs">Distance: ${formattedDistance} km</div>
                      <div class="text-xs">Duration: ${formattedDuration}</div>
                    </div>
                  `;
                  L.popup({ offset: [0, -10] }).setLatLng(latlng).setContent(html).openOn(map);
                },
              }}
            />
          );
        })}

        {/* VEHICLE MARKERS */}
        {vehicles.map((veh) => (
          <Marker key={veh.id} position={veh.location} icon={truckIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{veh.name}</div>
                <div className="text-gray-600 text-xs">ID: {veh.id}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
