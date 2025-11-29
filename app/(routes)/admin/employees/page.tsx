"use client";
import Sidebar from "@/components/admin/sidebar";
import { useEffect, useState } from "react";
import AddEmployeeModal from "@/components/admin/AddEmployeeModal";
import { deleteEmployee, getEmployees } from "@/services/employees";
import { EmployeeData } from "@/types/EmployeeData";
import EmployeeList from "@/components/admin/EmployeeList";
import RequireRole from "@/utils/RequireRole";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  useEffect(() => {
    // Fetch employees list when component mounts
    const fetchEmployees = async () => {
      const fetchedEmployees = await getEmployees();
      console.log(fetchedEmployees);
      setEmployees(fetchedEmployees);
    }
    fetchEmployees();
  }, []);
  const addEmployee = (employee: EmployeeData) => {
    setEmployees((prev) => [...prev, employee]);
  }
  const handleDelete = async (keycloakId: string) => {
    try{
    await deleteEmployee(keycloakId);
    toast.success("Employee deleted successfully");
    setEmployees((prev) => prev.filter((emp) => emp.keycloakId !== keycloakId));
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  }


  return (
<RequireRole roles={["admin-role"]}>
    <div className="flex mt-16">
      <Sidebar />
      <main className="flex-1 p-6 md:bg-gray-100 min-h-screen">
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
        <EmployeeList employees={employees} onDelete={handleDelete} />

          
        <AddEmployeeModal open={openModal} onClose={() => setOpenModal(false)} onAddEmployee={addEmployee}  />
      </main>
    </div>
    </RequireRole>
  );
}
export default AdminDashboard;