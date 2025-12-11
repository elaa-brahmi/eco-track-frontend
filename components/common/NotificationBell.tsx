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
    <div className="relative  z-[4000] ">
      {/* Bell Icon */}
      <button
        className="relative p-4 rounded-full bg-black cursor-pointer  z-[4000]"
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
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl p-3 max-h-96 overflow-y-auto  z-[4000]">

          <h3 className="font-semibold text-gray-700 mb-2">Notifications</h3>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm p-3">No notifications</p>
          ) : (
            <div className="space-y-2">
              {/* Admin view */}
              <RequireRole roles={["admin-role"]} redirect={false}>
                {notifications.map((notif, index) => {
                  const getReportTypeColor = (type: string) => {
                    switch (type?.toLowerCase()) {
                      case "overflow":
                        return "bg-red-100 text-red-800";
                      case "organic_waste_issue":
                        return "bg-yellow-100 text-yellow-800";
                      case "sanitation_problem":
                        return "bg-orange-100 text-orange-800";
                      default:
                        return "bg-gray-100 text-gray-800";
                    }
                  };

                  const getReportTypeIcon = (type: string) => {
                    switch (type?.toLowerCase()) {
                      case "overflow":
                        return "🔴";
                      case "organic_waste_issue":
                        return "⚠️";
                      case "sanitation_problem":
                        return "🚨";
                      default:
                        return "📋";
                    }
                  };

                  return (
                    <div
                      key={`admin-${index}`}
                      className="p-3 border border-blue-100 rounded-lg hover:shadow-md hover:border-blue-300 bg-blue-50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-lg">{getReportTypeIcon(notif.type)}</span>
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getReportTypeColor(notif.type)}`}>
                            {notif.type?.replace(/_/g, " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Report Details</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span>{Array.isArray(notif.location) ? notif.location.join(", ") : notif.location}</span>
                        </div>
                        {notif.description && (
                          <div className="flex items-start gap-1">
                            <span>📝</span>
                            <span className="line-clamp-2">{notif.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
