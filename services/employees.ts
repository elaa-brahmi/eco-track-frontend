// services/employee.ts
export interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
}

export const createEmployee = async (data: CreateEmployeeData): Promise<any> => {
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