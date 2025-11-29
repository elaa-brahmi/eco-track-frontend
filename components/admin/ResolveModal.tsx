"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useState } from "react"

const markerIcon = new L.Icon({
  iconUrl: "/pin.png",
  iconSize: [30, 30],
});

export default function ResolveModal({ report, onClose }: any) {
  const [task, setTask] = useState("")
  const [team, setTeam] = useState("")

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[600px] shadow-xl">

        <h2 className="text-xl font-bold mb-4">
          Resolve Report #{report.id}
        </h2>

        <div className="h-[250px] mb-4 rounded overflow-hidden">
          <MapContainer
            center={[report.location[0], report.location[1]]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[report.location[0], report.location[1]]}
              icon={markerIcon}
            >
              <Popup>Bin Location</Popup>
            </Marker>
          </MapContainer>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log("Task created:", { task, team, reportId: report.id })
            onClose()
          }}
        >
          <label className="block mb-2 font-semibold">Task Description</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded mb-4"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <label className="block mb-2 font-semibold">Assign Team</label>
          <select
            required
            className="w-full p-2 border rounded mb-4"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            <option value="">Choose team</option>
            <option value="Team A">Team A</option>
            <option value="Team B">Team B</option>
            <option value="Team C">Team C</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Task
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
