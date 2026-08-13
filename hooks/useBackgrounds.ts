"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type BackgroundImage = {
  id: string;
  name: string;
  type: "global" | "home" | "catalog" | "category" | "reviews" | "contacts" | "product";
  category?: string;
  image_url: string;
  overlay_color: string;
  overlay_opacity: number;
  position: "center" | "top" | "bottom" | "left" | "right";
  is_active: boolean;
  created_at: string;
};

export function useBackgrounds() {
  const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBackgrounds();
  }, []);

  const loadBackgrounds = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        console.error("Supabase client not available");
        setBackgrounds([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("background_images")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Background images table may not exist, using empty list");
        setBackgrounds([]);
      } else {
        setBackgrounds(data || []);
      }
    } catch (error) {
      console.error("Error loading backgrounds:", error);
      setBackgrounds([]);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundForType = (type: BackgroundImage["type"], category?: string): BackgroundImage | null => {
    // Сначала проверяем глобальный фон
    const globalBg = backgrounds.find(bg => bg.type === "global" && bg.is_active);
    if (globalBg) return globalBg;

    const filtered = backgrounds.filter(bg => 
      bg.type === type && bg.is_active
    );
    
    if (type === "category" && category) {
      const categoryBg = filtered.find(bg => bg.category === category);
      if (categoryBg) return categoryBg;
    }
    
    return filtered[0] || null;
  };

  return {
    backgrounds,
    loading,
    getBackgroundForType,
    reload: loadBackgrounds,
  };
}