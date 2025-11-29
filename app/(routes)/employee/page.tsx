"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TasksList from "@/components/employee/tasks/TasksList";
import RequireRole from "@/utils/RequireRole";
import { getEmployeeByKeycloakId } from "@/services/employees";
import Sidebar from "@/components/admin/dashboard/sidebar";

export default function EmployeeTasksPage() {
  const { data: session, status } = useSession();
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmployee() {
      if (!session?.user?.id) return;

      try {
        const emp = await getEmployeeByKeycloakId(session.user.id);
        console.log("Employee data:", emp);

        setEmployeeId(emp.id || null);
      } catch (err) {
        console.error("Failed to load employee:", err);
      }
    }

    loadEmployee();
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not authenticated.</p>;
  if (!employeeId) return <p>Loading employee data...</p>;

  return (
    <RequireRole roles={["employee-role"]}>
        <main className="p-6 mt-16">
          <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
          <TasksList employeeId={employeeId} />
        </main>
    </RequireRole>
  );
}
