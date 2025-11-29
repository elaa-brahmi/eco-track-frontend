import { Vehicle } from "@/types/vehicle";


export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const res = await fetch('/api/proxy/api/vehicules', {
    method: 'GET',
  });
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
};

export const addVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
  const res = await fetch('/api/proxy/api/vehicules', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error("Failed to add vehicle");
  return res.json();
};
