"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import RequireRole from "@/utils/RequireRole";

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
  console.log("notfications in bell:", notifications);
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
        className="relative p-4 rounded-full bg-black cursor-pointer"
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
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl p-3 max-h-96 overflow-y-auto z-50">

          <h3 className="font-semibold text-gray-700 mb-2">Notifications</h3>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            <div className="space-y-2">
              {/* Admin view */}
              <RequireRole roles={["admin-role"]} redirect={false}>
                {notifications.map((notif, index) => (
                  <div
                    key={`admin-${index}`}
                    className="p-2 border-b border-gray-100 rounded hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      Report: <span className="font-semibold">{notif.type}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {Array.isArray(notif.location) ? notif.location.join(", ") : notif.location}
                    </p>
                  </div>
                ))}
              </RequireRole>

              {/* Employee view */}
              <RequireRole roles={["employee-role"]} redirect={false}>
                {notifications.map((notif, index) => (
                  <div
                    key={`emp-${index}`}
                    className="p-3 border border-gray-100 rounded-lg hover:shadow-sm bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Due: {notif.dueDate ? new Date(notif.dueDate).toLocaleString() : 'N/A'}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded ${notif.priority === 'HIGH' ? 'bg-red-100 text-red-700' : notif.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {notif.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Containers: {Array.isArray(notif.containersIDs) ? notif.containersIDs.join(', ') : ''}</p>
                  </div>
                ))}
              </RequireRole>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
