import { EmployeeData } from "@/types/EmployeeData";


export const createEmployee = async (data: EmployeeData): Promise<any> => {
  const res = await fetch("/api/proxy/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create employee");
  }

  return res.json();
};
export const getEmployees = async (): Promise<EmployeeData[]> => {
  const res = await fetch("/api/proxy/api/employees", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch employees");
  }
  return res.json();
}
export const deleteEmployee = async (keycloakId: string): Promise<void> => {
  const res = await fetch(`/api/proxy/api/employees/${keycloakId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to delete employee");
  }
  return;
}