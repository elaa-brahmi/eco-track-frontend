import { EmployeeData } from "@/types/EmployeeData";
import { Trash2Icon } from "lucide-react";

export default function EmployeeList({ employees ,onDelete }: { employees: EmployeeData[],onDelete: (keycloakId: string) => void; }) {
    
  return (
    <div className="mt-6 overflow-x-auto">
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
  );
}