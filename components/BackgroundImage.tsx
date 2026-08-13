"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type BackgroundSettings = {
  home_bg_url: string | null;
  shop_bg_url: string | null;
  apply_global: boolean;
  overlay_opacity: number;
  blur_enabled: boolean;
};

type BackgroundProps = {
  page: "home" | "shop";
  children: React.ReactNode;
};

export function BackgroundImage({ page, children }: BackgroundProps) {
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<BackgroundSettings | null>(null);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client not available");
      return;
    }

    console.log("Loading background for page:", page);

    supabase
      .from("background_settings")
      .select("*")
      .single()
      .then(({ data, error }: { data: BackgroundSettings | null; error: { message: string } | null }) => {
        console.log("Query result - data:", data, "error:", error);
        if (!error && data) {
          console.log("Background settings loaded:", data);
          setSettings(data);

          let urlToUse: string | null = null;

          if (data.apply_global) {
            console.log("Using global background (shop_bg_url):", data.shop_bg_url);
            urlToUse = data.shop_bg_url;
          } else {
            if (page === "home") {
              console.log("Setting home background:", data.home_bg_url);
              urlToUse = data.home_bg_url;
            } else {
              console.log("Setting shop background:", data.shop_bg_url);
              urlToUse = data.shop_bg_url;
            }
          }

          setBgUrl(urlToUse);
        } else if (error) {
          console.error("Error fetching background settings:", error);
        }
      });
  }, [page]);

  const overlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    zIndex: -2,
  };

  const darkOverlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0, 0, 0, ${settings?.overlay_opacity || 0.5})`,
    backdropFilter: settings?.blur_enabled ? "blur(4px)" : "none",
    zIndex: -1,
  };

  return (
    <>
      {bgUrl && <div style={overlayStyle} />}
      {bgUrl && <div style={darkOverlayStyle} />}
      {children}
    </>
  );
}