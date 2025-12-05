"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchBins } from "@/services/containers";
import { BinData } from "@/types/BinData";

const greenIcon = new L.Icon({
  iconUrl: "/green-bin.png",
  iconSize: [35, 45],
});

const redIcon = new L.Icon({
  iconUrl: "/red-bin.png",
  iconSize: [65, 45],
});

export default function BinsMapLeaflet() {
  const [bins, setBins] = useState<BinData[]>([]);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      setBins(await fetchBins());
    }
    load();
  }, []);

  // Listen for sidebar open/close and invalidate map size
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener("sidebar-toggle", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("sidebar-toggle", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    // `isolate` creates a new stacking context so Leaflet elements can't escape
    <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] transition-all duration-300 relative z-0 isolate">
      <MapContainer
        center={[34.7400, 10.7600]}
        zoom={12}
        ref={mapRef}
        className="leaflet-container z-0"
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {bins.map((bin) => (
          <Marker
            key={bin.id}
            position={bin.location}
            icon={bin.fillLevel && bin.fillLevel > 75 ? redIcon : greenIcon}
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
      </MapContainer>
    </div>
  );
}
