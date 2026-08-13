"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type BackgroundSettings = {
  id: string;
  home_bg_url: string | null;
  shop_bg_url: string | null;
  apply_global: boolean;
  overlay_opacity: number;
  blur_enabled: boolean;
};

export function BackgroundSettings() {
  const [settings, setSettings] = useState<BackgroundSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeBgInput, setHomeBgInput] = useState("");
  const [shopBgInput, setShopBgInput] = useState("");
  const [homeBgFile, setHomeBgFile] = useState<File | null>(null);
  const [shopBgFile, setShopBgFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client not available");
      setLoading(false);
      return;
    }

    console.log("Loading background settings...");

    supabase
      .from("background_settings")
      .select("*")
      .single()
      .then(({ data, error }: { data: BackgroundSettings | null; error: { message: string } | null }) => {
        if (!error && data) {
          console.log("Settings loaded:", data);
          setSettings(data);
          setHomeBgInput(data.home_bg_url || "");
          setShopBgInput(data.shop_bg_url || "");
        } else if (error) {
          console.error("Error fetching background settings:", error);
        }
        setLoading(false);
      });
  }, []);

  const handleImageUpload = async (file: File, type: 'home' | 'shop') => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = fileName; // Убираем backgrounds/ из пути, так как бакет уже называется backgrounds

      console.log("Uploading file:", filePath);

      const { data, error } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

      if (error) {
        console.error("Storage upload error:", error);
        throw error;
      }

      console.log("Upload successful:", data);

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('backgrounds')
          .getPublicUrl(data.path);

        console.log("Public URL:", publicUrl);

        if (type === 'home') {
          setHomeBgInput(publicUrl);
        } else {
          setShopBgInput(publicUrl);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Ошибка загрузки изображения: " + (error as any).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    console.log("Saving settings:", {
      home_bg_url: homeBgInput || null,
      shop_bg_url: shopBgInput || null,
      apply_global: settings.apply_global,
      overlay_opacity: settings.overlay_opacity,
      blur_enabled: settings.blur_enabled,
      id: settings.id
    });

    setSaving(true);
    const { data, error } = await supabase
      .from("background_settings")
      .update({
        home_bg_url: homeBgInput || null,
        shop_bg_url: shopBgInput || null,
        apply_global: settings.apply_global,
        overlay_opacity: settings.overlay_opacity,
        blur_enabled: settings.blur_enabled,
      })
      .eq("id", settings.id)
      .select()
      .single();

    if (!error) {
      console.log("Settings saved successfully:", data);
      alert("Настройки сохранены! Обновите страницу сайта, чтобы увидеть изменения.");
    } else {
      console.error("Error saving settings:", error);
      alert("Ошибка сохранения: " + error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Фоны
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
        Фоны
      </h2>

      <div className="space-y-4">
        {/* Главная страница */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
            Фон главной страницы
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setHomeBgFile(file);
                handleImageUpload(file, 'home');
              }
            }}
            className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
          />
          {homeBgInput && (
            <div className="mt-2">
              <div className="relative">
                <Image
                  src={homeBgInput}
                  alt="Preview"
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setHomeBgInput("");
                    setHomeBgFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Магазин */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
            Фон магазина
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setShopBgFile(file);
                handleImageUpload(file, 'shop');
              }
            }}
            className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
          />
          {shopBgInput && (
            <div className="mt-2">
              <div className="relative">
                <Image
                  src={shopBgInput}
                  alt="Preview"
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setShopBgInput("");
                    setShopBgFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Глобальный фон */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="applyGlobal"
            checked={settings?.apply_global || false}
            onChange={(e) => setSettings({ ...settings!, apply_global: e.target.checked })}
            className="sr-only"
          />
          <label
            htmlFor="applyGlobal"
            className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
              settings?.apply_global
                ? "border-white bg-white text-black"
                : "border-surface-border text-white hover:border-white/50"
            }`}
          >
            <span className="text-xs font-medium">Применить магазинный фон везде</span>
          </label>
        </div>

        {/* Размытие */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="blurEnabled"
            checked={settings?.blur_enabled || false}
            onChange={(e) => setSettings({ ...settings!, blur_enabled: e.target.checked })}
            className="sr-only"
          />
          <label
            htmlFor="blurEnabled"
            className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
              settings?.blur_enabled
                ? "border-white bg-white text-black"
                : "border-surface-border text-white hover:border-white/50"
            }`}
          >
            <span className="text-xs font-medium">Включить размытие</span>
          </label>
        </div>

        {/* Затемнение */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
            Затемнение: {Math.round((settings?.overlay_opacity || 0.5) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings?.overlay_opacity || 0.5}
            onChange={(e) => setSettings({ ...settings!, overlay_opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Сохранить */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black disabled:opacity-40"
        >
          {saving ? "Сохранение..." : uploading ? "Загрузка..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}