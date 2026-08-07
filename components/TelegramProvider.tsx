"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor("#000000");
    WebApp.setBackgroundColor("#000000");
  }, []);

  return <>{children}</>;
}
