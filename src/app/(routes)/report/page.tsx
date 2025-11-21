"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "/pin.png",
  iconSize: [20, 38],
  iconAnchor: [12, 41],
});

export default function ReportForm() {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File>(null);
  const [location, setLocation] = useState<number[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setError("Unable to retrieve your location.");
      }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const reportData = {
      description,
      photo,
      location,
    };

    console.log("Citizen Report Submitted:", reportData);
  };

  return (
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-[#0d1224]">
        Submit a Bin Report
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-gray-600  rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            rows="4"
            placeholder="Describe the issue with the garbage bin..."
          />
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-2">
            Photo 
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full border border-gray-400 rounded-lg p-3 bg-gray-50 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-3">
            Your Location
          </label>

          {location ? (
            <div className="h-64 w-full rounded-lg overflow-hidden border">
              <MapContainer
                center={location}
                zoom={16}
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={location} icon={markerIcon}>
                  <Popup>You are here</Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <p className="text-gray-600">
              {error ? error : "Detecting your location..."}
            </p>
          )}

          {location && (
            <p className="mt-2 text-md text-gray-700">
              Coordinates:{" "}
              <span className="font-semibold text-blue-600 ">
                [{location[1].toFixed(4)}, {location[0].toFixed(4)}]
              </span>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#0d1224] text-white text-md  font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
