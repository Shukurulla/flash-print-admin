// src/components/Notifications.jsx
import React from "react";
import { useSocket } from "../contexts/SocketContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Notifications = () => {
  const { notifications, clearNotification } = useSocket();

  if (notifications.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Yangi bildirishnomalar yo'q</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex justify-between items-start p-3 mb-2 rounded-md ${
            notification.type === "qogozKam"
              ? "bg-red-50 border-l-4 border-red-500"
              : "bg-green-50 border-l-4 border-green-500"
          }`}
        >
          <div>
            <p className="font-medium mb-1">{notification.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(notification.vaqt).toLocaleTimeString()} - Apparat ID:{" "}
              {notification.apparatId}
            </p>
          </div>
          <button
            onClick={() => clearNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
