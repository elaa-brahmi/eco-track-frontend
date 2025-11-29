"use client";
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";
import { addVehicle } from "@/services/vehicles";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (vehicle: Vehicle) => void;
}

export default function AddVehicleModal({ open, onClose, onAdded }: Props) {
  const [name, setName] = useState("");
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vehicle: Vehicle = {
        name,
        location: [lat, lng],
        capacity,
      };

      const res = await addVehicle(vehicle);
      console.log(res);
      onAdded(res);

      toast.success("Vehicle added successfully");
      onClose();
      setName("");
      setLat(0);
      setLng(0);
      setCapacity(0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Latitude</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Longitude</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
