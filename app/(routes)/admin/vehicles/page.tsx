"use client";
import { useState } from "react";
import VehiclesTable from "@/components/admin/vehicles/VehiclesTable";
import AddVehicleModal from "@/components/admin/vehicles/AddVehicleModal";
import { Vehicle } from "@/types/vehicle";
import RequireRole from "@/utils/RequireRole";
import Sidebar from "@/components/admin/dashboard/sidebar";
import { useEffect } from "react";
import { getAllVehicles } from "@/services/vehicles";
export default function VehiclesPage() {
    const [openModal, setOpenModal] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadVehicles() {
          try {
            const data = await getAllVehicles();
            setVehicles(data);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
        loadVehicles();
      }, []);


    const handleAdded = (v: Vehicle) => {
        setVehicles((prev) => [...prev, v]);
    };
    if (loading) return <p>Loading vehicles...</p>;

    return (
        <RequireRole roles={["admin-role"]}>
            <div className="flex mt-16">
                <Sidebar />

                <div className="p-6 flex-1 md:bg-gray-100 min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Vehicles Management</h1>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Vehicle
                    </button>

                    <VehiclesTable  vehicles={vehicles}/>

                    <AddVehicleModal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        onAdded={handleAdded}
                    />
                </div>
            </div>
        </RequireRole>
    );
}
