"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { connectToWS } from "@/services/ws";
import { useSession } from "next-auth/react";

type NotificationContextValue = {
  notifications: any[];
  unread: number;
  setUnread: React.Dispatch<React.SetStateAction<number>>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const rolesArray = Array.isArray(session?.user?.roles) ? session.user.roles : [];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!rolesArray.includes("admin-role")) return;

    // Only admin notifications come from /topic/reports
    const handlers = {
      "/topic/reports": (report: any) => {
        setNotifications((prev) => [report, ...prev]);
        setUnread((u) => u + 1);
      }
    };

    const client = connectToWS(handlers);
    return () => {
      // call deactivate without returning its Promise so the cleanup is synchronous
      client.deactivate();
    };
  }, [rolesArray]);

  return (
    <NotificationContext.Provider value={{ notifications, unread, setUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
