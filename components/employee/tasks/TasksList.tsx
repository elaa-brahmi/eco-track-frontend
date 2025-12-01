"use client";

import { useEffect, useState, useCallback } from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";
import { getTasksByEmployeeId } from "@/services/tasks";

interface TasksListProps {
  employeeId: string;
}

export default function TasksList({ employeeId }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasksByEmployeeId(employeeId);
      setTasks(data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-3 inline-block">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-1">Failed to load tasks</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No tasks assigned yet</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon for new assignments</p>
        </div>
      </div>
    );
  }

  // Sort tasks: PENDING first, then IN_PROGRESS, then COMPLETED
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder: Record<string, number> = { 
      PENDING: 0, 
      IN_PROGRESS: 1, 
      COMPLETED: 2 
    };
    const aPriority = statusOrder[a.status] ?? 99;
    const bPriority = statusOrder[b.status] ?? 99;
    return aPriority - bPriority;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} onTaskCompleted={loadTasks} employeeId={employeeId} />
      ))}
    </div>
  );
}
