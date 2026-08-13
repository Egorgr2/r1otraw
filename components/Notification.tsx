"use client";

import { useState } from "react";

type UseNotificationReturn = {
  notification: { type: "success" | "error" | "info"; message: string } | null;
  showNotification: (type: "success" | "error" | "info", message: string) => void;
  hideNotification: () => void;
};

export function useNotification(): UseNotificationReturn {
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const hideNotification = () => setNotification(null);

  return { notification, showNotification, hideNotification };
}

export function Notification({ notification, onClose }: { notification: { type: "success" | "error" | "info"; message: string } | null; onClose: () => void }) {
  if (!notification) return null;

  const colors = {
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div className={`fixed top-4 right-4 z-50 border px-4 py-3 rounded-lg ${colors[notification.type]}`}>
      <div className="flex items-center gap-3">
        <span className="text-sm">{notification.message}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-muted"
        >
          ✕
        </button>
      </div>
    </div>
  );
}