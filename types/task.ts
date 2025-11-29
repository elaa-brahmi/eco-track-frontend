export interface Task {
  id: string;
  containersIDs: string[];
  vehiculeId: string;
  employeesIDs: string[];
  title: string;
  status: "PENDING" | "IN_PROGRESS"  | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  reportId: string | null;
  createdAt: string;
}
