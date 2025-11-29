"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { completeTask } from "@/services/tasks";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onTaskCompleted?: () => void;
}

export default function TaskCard({ task, onTaskCompleted }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-50 border-green-200 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "PENDING":
        return "bg-orange-50 border-orange-200 text-orange-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status?.toUpperCase() !== "COMPLETED";

  const handleMarkCompleted = async () => {
    setIsLoading(true);
    try {
      const response = await completeTask(task.id);
      console.log("Task marked as completed:", response);
      toast.success("Task marked as completed");
      // Refresh the task list to update UI
      if (onTaskCompleted) {
        onTaskCompleted();
      }
    } catch (error) {
      toast.error("Failed to mark task as completed");
      console.error("Failed to mark task as completed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full p-5 rounded-lg border-2 transition-all hover:shadow-lg ${
      isOverdue ? "bg-red-50 border-red-200" : "bg-white border-gray-200 hover:border-gray-300"
    }`}>
      {/* Header with Title and Priority */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-2">{task.title}</h3>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getPriorityColor(task.priority)}`}>
          {task.priority?.toUpperCase()}
        </span>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
          getStatusColor(task.status)
        }`}>
          {task.status?.replace(/_/g, " ").toUpperCase()}
        </span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`text-sm mb-3 flex items-center gap-2 ${
          isOverdue ? "text-red-600 font-medium" : "text-gray-600"
        }`}>
          <span>📅</span>
          <span>
            {isOverdue && <span className="font-bold">Overdue: </span>}
            {new Date(task.dueDate).toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric",
              year: task.dueDate && new Date(task.dueDate).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
            })}
          </span>
        </div>
      )}

      {/* Assigned Employees Count */}
      <div className="text-sm text-gray-600 flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 mb-3">
        <span>👥</span>
        <span>{task.employeesIDs?.length || 0} employee(s) assigned</span>
      </div>

      {/* Action Button */}
      {task.status?.toUpperCase() === "COMPLETED" ? (
        <button
          disabled
          className="w-full px-4 py-2.5 bg-green-100 hover:bg-green-100 text-green-800 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <span>✓</span>
          Completed
        </button>
      ) : (
        <button
          onClick={handleMarkCompleted}
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </>
          ) : (
            <>
              ✓ Mark as Completed
            </>
          )}
        </button>
      )}
    </div>
  );
}
