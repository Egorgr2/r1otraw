"use client";

import { useEffect } from "react";

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import("@twa-dev/sdk").then((WebApp) => {
      WebApp.default.ready();
      WebApp.default.expand();
      WebApp.default.setHeaderColor("#000000");
      WebApp.default.setBackgroundColor("#000000");
    });
  }, []);

  return <>{children}</>;
}
