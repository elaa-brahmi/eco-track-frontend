"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { createReport } from "@/services/report"
import RequireRole from "@/utils/RequireRole"

// DYNAMIC IMPORTS — THIS IS THE ONLY SAFE WAY
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false })

export default function ReportForm() {
  const [isMounted, setIsMounted] = useState(false)
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [location, setLocation] = useState<[number, number] | null>(null)
  const [error, setError] = useState("")
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null)

  // ONLY RUN IN BROWSER
  useEffect(() => {
    setIsMounted(true)

    // Fix Leaflet icon + create custom icon (dynamically import to avoid SSR/require issues)
    ;(async () => {
      const L = await import("leaflet")
      // remove any default icon url getter and set explicit image urls
      try {
        Reflect.deleteProperty(L.Icon.Default.prototype, "_getIconUrl")
      } catch {
        // ignore if not present
      }

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      // Create your custom pin
      const icon = new L.Icon({
        iconUrl: "/pin.png",
        iconSize: [20, 38],
        iconAnchor: [12, 41],
      })
      setMarkerIcon(icon)
    })()
  }, [])

  // GEOLOCATION — only after mount
  useEffect(() => {
    if (!isMounted) return

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude])
        setError("")
      },
      () => {
        setError("Unable to retrieve your location. Please enable location access.")
      },
      { timeout: 10000 }
    )
  }, [isMounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photo || !location) {
      setError("Photo and location are required.")
      return
    }

    try {
      await createReport({
        file: photo,
        description,
        location: `${location[0]},${location[1]}`,
      })

      setDescription("")
      setPhoto(null)
      setError("")
      alert("Report submitted successfully!")
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError(String(err) || "Failed to submit report")
    }
  }

  // PREVENT HYDRATION MISMATCH
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl">Loading map...</div>
      </div>
    )
  }

  return (
    <RequireRole roles={["citizen-role"]}>
      <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 border mt-10 border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-[#0d1224]">Submit a Bin Report</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
              rows={4}
              placeholder="Describe the issue with the garbage bin..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">Your Location</label>

            {location ? (
              <div className="h-80 w-full rounded-lg overflow-hidden border border-gray-300 shadow-md">
                <MapContainer center={location} zoom={16} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {markerIcon && <Marker position={location} icon={markerIcon}>
                    <Popup>You are here</Popup>
                  </Marker>}
                </MapContainer>
              </div>
            ) : (
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center border">
                <p className="text-gray-600">{error || "Detecting your location..."}</p>
              </div>
            )}

            {location && (
              <p className="mt-3 text-sm text-gray-700">
                Coordinates: <span className="font-mono font-bold text-blue-600">
                  [{location[0].toFixed(6)}, {location[1].toFixed(6)}]
                </span>
              </p>
            )}
          </div>

          {error && <p className="text-red-600 font-semibold bg-red-50 p-4 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={!photo || !location}
            className="w-full bg-[#0d1224] text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
        </form>
      </div>
    </RequireRole>
  )
}