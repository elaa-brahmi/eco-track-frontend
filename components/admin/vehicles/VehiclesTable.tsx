"use client";

import { Vehicle } from "@/types/vehicle";

export default function VehiclesTable({ vehicles }: { vehicles: Vehicle[] }) {

  

  

  return (
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
  );
}
