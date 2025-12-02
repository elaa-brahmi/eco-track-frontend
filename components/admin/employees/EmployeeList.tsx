import { EmployeeData } from "@/types/EmployeeData";
import { Trash2Icon } from "lucide-react";

export default function EmployeeList({ employees ,onDelete }: { employees: EmployeeData[],onDelete: (keycloakId: string) => void; }) {
    
  return (
    <div className="mt-6">
      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{emp.email}</p>
              </div>
              <button
                onClick={() => onDelete(emp.keycloakId as string)}
                className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded transition"
              >
                <Trash2Icon size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                <strong>Role:</strong> {emp.role ?? "—"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">{emp.name}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.role ?? "—"}</td>
                <td><Trash2Icon className="cursor-pointer" onClick={() => onDelete(emp.keycloakId as string)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}