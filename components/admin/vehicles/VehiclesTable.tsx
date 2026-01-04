
import { Vehicle } from "@/types/vehicle";

export default function VehiclesTable({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div>
      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{v.name}</h3>
              <span
                className={`text-xs px-2.5 py-1 rounded-full ${
                  v.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {v.available ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-700">Location:</span>{" "}
                {v.location.join(", ")}
              </div>
              <div>
                <span className="font-medium text-gray-700">Capacity:</span>{" "}
                {v.capacity}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Available</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr className="border-t hover:bg-gray-50 transition" key={v.id}>
                <td className="p-2 text-center ">{v.name}</td>
                <td className="p-2 text-center">{v.available ? "Yes" : "No"}</td>
                <td className="p-2 text-center">{v.location.join(", ")}</td>
                <td className="p-2 text-center">{v.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
