"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { connectToWS } from "@/services/ws";
import { useSession } from "next-auth/react";
import {  getEmployeeByKeycloakId } from "@/services/employees";

type NotificationContextValue = {
  notifications: any[];
  unread: number;
  setUnread: React.Dispatch<React.SetStateAction<number>>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const rolesArray = Array.isArray(session?.user?.roles) ? session.user.roles : [];
  const [employeeId, setEmployeeId] = useState<string>("");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);

  // Fetch employeeId based on keycloakId - only for employees
  useEffect(() => {
    if (!rolesArray.includes("employee-role")) return;
    if (!session) return;

    async function fetchEmployeeId() {
      try {
        const keycloakId = session?.user?.id as string;

        const emp = await getEmployeeByKeycloakId(keycloakId);
        setEmployeeId(emp.id || "");
      } catch (err) {
        console.error("Failed to fetch employee ID:", err);
      }
    }

    fetchEmployeeId();
  }, [ session]);

  useEffect(() => {
    if (rolesArray.length === 0) return;

    const handlers: Record<string, (data: any) => void> = {};

    // Admin: subscribe to /topic/reports
    if (rolesArray.includes("admin-role")) {
      handlers["/topic/reports"] = (report: any) => {
        setNotifications((prev) => [report, ...prev]);
        setUnread((u) => u + 1);
      };
    }

    // Employee: subscribe to /topic/tasks and filter by employeeId
    if (rolesArray.includes("employee-role")) {
      handlers["/topic/tasks"] = (task: any) => {
        // Only add task if current employee is in the employeesIDs array
        if (task.employeesIDs?.includes(employeeId)) {
          setNotifications((prev) => [task, ...prev]);
          setUnread((u) => u + 1);
        }
      };
    }

    // Only connect if there are handlers to set up
    if (Object.keys(handlers).length === 0) return;

    const client = connectToWS(handlers);
    return () => {
      client.deactivate();
    };
  }, [rolesArray, employeeId]);

  return (
    <NotificationContext.Provider value={{ notifications, unread, setUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
