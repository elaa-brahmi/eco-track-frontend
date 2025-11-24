"use client";

import { useState } from "react";
import { createEmployee } from "@/services/employees";
import { toast } from "sonner";
import { EmployeeData } from "@/types/EmployeeData";

interface Props {
  open: boolean;
  onAddEmployee: (employee: EmployeeData) => void;
  onClose: () => void;
  onSuccess?: () => void; 
}

export default function AddEmployeeModal({ open, onClose,onAddEmployee, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createEmployee({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role.trim(),
      });
      toast.success("Employee created successfully");


      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create employee");
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
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ahmed Ben Salah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ahmed@wasteflow.tn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Strong password (8+ chars)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              type="text"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="technician"
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
                   Creating...
                </>
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}