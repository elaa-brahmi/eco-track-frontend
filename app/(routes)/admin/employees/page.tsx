"use client";
import Sidebar from "@/components/admin/sidebar";
import { useState } from "react";
import AddEmployeeModal from "@/components/admin/AddEmployeeModal";

export default function AdminDashboard() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex mt-16">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold">Employees Management</h1>
        <p className="text-gray-500 text-sm">
          Manage and oversee employee activities
        </p>

        <button
          onClick={() => setOpenModal(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add New Employee
        </button>

        <AddEmployeeModal open={openModal} onClose={() => setOpenModal(false)} />
      </main>
    </div>
  );
}
