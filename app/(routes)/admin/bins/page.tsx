"use client";
import AddBineModal from "@/components/admin/AddBineModal";
import BinsTable from "@/components/admin/BinsTable";
import Sidebar from "@/components/admin/sidebar";
import { fetchBins } from "@/services/containers";
import { connectToWS } from "@/services/ws";
import { BinData } from "@/types/BinData";
import RequireRole from "@/utils/RequireRole";
import { useEffect, useState } from "react";

const BinsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [bins, setBins] = useState<BinData[]>([]);
  useEffect(() => {
    const load = async () => {
      const fetchedBins = await fetchBins();
      setBins(fetchedBins);
    };
    load();

    //  connect to websocket and receive updates
   const client = connectToWS({
    "/topic/containers": (updatedBin: BinData) => {
      setBins(prev => prev.map(b => b.id === updatedBin.id ? updatedBin : b));
    }
  });

    return () => {
      client.deactivate();
    };
  }, []);

  const addBin = (bin: BinData) => {
    setBins((prev) => [...prev, bin]);
  }
  return (
    <RequireRole roles={["admin-role"]}>
      <div className="flex mt-16">
        <Sidebar />
        <main className="flex-1 p-6 md:bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold">Bins Management</h1>
          <p className="text-gray-500 text-sm">
            Manage and oversee bin activities
          </p>

          <button
            onClick={() => setOpenModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add New bin
          </button>
          <BinsTable bins={bins} />


          <AddBineModal open={openModal} onClose={() => setOpenModal(false)} onAddBin={addBin} />
        </main>
      </div>
    </RequireRole>
  );
}
export default BinsPage;