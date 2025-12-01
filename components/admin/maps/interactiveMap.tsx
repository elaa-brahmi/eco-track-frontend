"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchBins } from "@/services/containers";
import { BinData } from "@/types/BinData";

// Fix Leaflet icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: "",
});

const greenIcon = new L.Icon({
  iconUrl: "/green-bin.png",
  iconSize: [35, 45],
});

const redIcon = new L.Icon({
  iconUrl: "/red-bin.png",
  iconSize: [35, 45],
});

export default function BinsMapLeaflet() {
  const [bins, setBins] = useState<BinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBins();
        console.log("Fetched bins:", data);
        setBins(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading map...</p>;

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[36.8065, 10.1815]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
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
