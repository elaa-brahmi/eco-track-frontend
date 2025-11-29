"use client";
import { useState } from "react";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  notifications: any[];
  unreadCount: number;
  onOpen: () => void;
}

export default function NotificationBell({
  notifications,
  unreadCount,
  onOpen,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const newState = !open;
    setOpen(newState);

    if (newState) onOpen(); // reset unread when opening
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        className="relative p-4 rounded-full bg-black curoser-pointer"
        onClick={toggle}
      >
        <Bell className="w-7 h-7 text-white" />

        {/* Unread Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-xl p-3 max-h-80 overflow-y-auto z-50">

          <h3 className="font-semibold text-gray-700 mb-2">Notifications</h3>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((notif, index) => (
              <div
                key={index}
                className="p-2 border-b border-gray-100 rounded hover:bg-gray-50"
              >
                <p className="text-sm font-medium">
                  New report: {notif.type}
                </p>
                <p className="text-xs text-gray-500">
                  {notif.location?.join(", ")}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
