"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ShopSettings = {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  shop_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  social_links: Record<string, string>;
  custom_css: string | null;
  custom_js: string | null;
};

export function ShopCustomization() {
  const [settings, setSettings] = useState<ShopSettings>({
    id: "default",
    primary_color: "#ffffff",
    secondary_color: "#000000",
    accent_color: "#ff0000",
    logo_url: process.env.NEXT_PUBLIC_LOGO_URL || null,
    shop_name: process.env.NEXT_PUBLIC_SHOP_NAME || "R1OTRAW",
    contact_email: null,
    contact_phone: null,
    social_links: {},
    custom_css: null,
    custom_js: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client not available");
      return;
    }
    
    setLoading(true);
    supabase
      .from("shop_settings")
      .select("*")
      .single()
      .then(({ data, error }: { data: ShopSettings | null; error: { message: string } | null }) => {
        if (!error && data) {
          setSettings(data);
        } else if (error) {
          console.log("Shop settings table may not exist, using defaults");
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    
    try {
      // Проверяем, существует ли запись
      const { data: existingData } = await supabase
        .from("shop_settings")
        .select("id")
        .eq("id", "default")
        .single();

      let error;
      
      if (existingData) {
        // Обновляем существующую запись
        const result = await supabase
          .from("shop_settings")
          .update({
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            accent_color: settings.accent_color,
            logo_url: settings.logo_url,
            shop_name: settings.shop_name,
            contact_email: settings.contact_email,
            contact_phone: settings.contact_phone,
            social_links: settings.social_links,
            custom_css: settings.custom_css,
            custom_js: settings.custom_js,
          })
          .eq("id", settings.id);
        error = result.error;
      } else {
        // Создаем новую запись
        const result = await supabase
          .from("shop_settings")
          .insert({
            id: settings.id,
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            accent_color: settings.accent_color,
            logo_url: settings.logo_url,
            shop_name: settings.shop_name,
            contact_email: settings.contact_email,
            contact_phone: settings.contact_phone,
            social_links: settings.social_links,
            custom_css: settings.custom_css,
            custom_js: settings.custom_js,
          });
        error = result.error;
      }

      if (!error) {
        alert("Настройки сохранены!");
      } else {
        console.error("Error saving settings:", error);
        alert("Ошибка сохранения: " + error.message);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Ошибка сохранения");
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Кастомизация магазина
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-surface-raised rounded mb-3"></div>
          <div className="h-10 bg-surface-raised rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-surface-border p-4">
      <h2 className="mb-4 text-xs uppercase tracking-street">
        Кастомизация магазина
      </h2>

      <div className="space-y-4">
        {/* Название магазина */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
            Название магазина
          </label>
          <input
            type="text"
            value={settings?.shop_name || ""}
            onChange={(e) => setSettings({ ...settings!, shop_name: e.target.value })}
            className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
          />
        </div>

        {/* Логотип */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
            URL логотипа
          </label>
          <input
            type="text"
            value={settings?.logo_url || ""}
            onChange={(e) => setSettings({ ...settings!, logo_url: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
          />
        </div>

        {/* Цвета */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
              Основной цвет
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings?.primary_color || "#ffffff"}
                onChange={(e) => setSettings({ ...settings!, primary_color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings?.primary_color || "#ffffff"}
                onChange={(e) => setSettings({ ...settings!, primary_color: e.target.value })}
                className="flex-1 border border-surface-border bg-black px-2 py-2 text-xs text-white focus:border-white focus:outline-none rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
              Вторичный цвет
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings?.secondary_color || "#000000"}
                onChange={(e) => setSettings({ ...settings!, secondary_color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings?.secondary_color || "#000000"}
                onChange={(e) => setSettings({ ...settings!, secondary_color: e.target.value })}
                className="flex-1 border border-surface-border bg-black px-2 py-2 text-xs text-white focus:border-white focus:outline-none rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
              Акцентный цвет
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings?.accent_color || "#333333"}
                onChange={(e) => setSettings({ ...settings!, accent_color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings?.accent_color || "#333333"}
                onChange={(e) => setSettings({ ...settings!, accent_color: e.target.value })}
                className="flex-1 border border-surface-border bg-black px-2 py-2 text-xs text-white focus:border-white focus:outline-none rounded"
              />
            </div>
          </div>
        </div>

        {/* Контакты */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings?.contact_email || ""}
              onChange={(e) => setSettings({ ...settings!, contact_email: e.target.value })}
              className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={settings?.contact_phone || ""}
              onChange={(e) => setSettings({ ...settings!, contact_phone: e.target.value })}
              className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
            />
          </div>
        </div>

        {/* Custom CSS */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
            Custom CSS
          </label>
          <textarea
            value={settings?.custom_css || ""}
            onChange={(e) => setSettings({ ...settings!, custom_css: e.target.value })}
            placeholder="/* Ваши CSS стили */"
            rows={4}
            className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded font-mono"
          />
        </div>

        {/* Сохранить */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black disabled:opacity-40"
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}