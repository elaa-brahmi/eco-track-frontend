"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BinData } from "@/types/BinData";
import { createBin } from "@/services/containers";

interface Props {
  open: boolean;
  onAddBin: (employee: BinData) => void;
  onClose: () => void;
  onSuccess?: () => void; 
}

export default function AddEmployeeModal({ open, onClose,onAddBin, onSuccess }: Props) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCreateBin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const created = await createBin({
        location: location.split(",").map(Number) as [number, number],
        type: type.trim() as any,
        status: status.trim() as any,
      });
      toast.success("bin added successfully");

      onAddBin(created);

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create bin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Add New Bin</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateBin} className="space-y-4">
          

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" disabled>
                Select a status
              </option>
              <option value="normal">normal</option>
              <option value="under_maintenance">under_maintenance</option>
              <option value="broken">broken</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="plastic">plastic</option>
              <option value="organic">organic</option>
              <option value="paper">paper</option>
              <option value="glass">glass</option>
              
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Location (lat,lng)</label>
            <input
              value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="36.8065,10.1815"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  adding...
                </>
              ) : (
                "add Bin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}