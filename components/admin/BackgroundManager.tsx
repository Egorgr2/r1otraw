"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

export function BackgroundManager() {
  const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "home" as BackgroundImage["type"],
    category: "",
    overlay_color: "#000000",
    overlay_opacity: 0.5,
    position: "center" as BackgroundImage["position"],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

      const { data, error } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('backgrounds')
          .getPublicUrl(data.path);

        return publicUrl;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Ошибка загрузки изображения");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Введите название фона");
      return;
    }

    if (!imageFile) {
      alert("Выберите изображение");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await handleImageUpload(imageFile);
      
      if (!imageUrl) {
        return;
      }

      // Создаем запись в таблице background_images
      const { error } = await supabase
        .from("background_images")
        .insert({
          name: formData.name,
          type: formData.type,
          category: formData.category || null,
          image_url: imageUrl,
          overlay_color: formData.overlay_color,
          overlay_opacity: formData.overlay_opacity,
          position: formData.position,
          is_active: true,
        });

      if (error) {
        if (error.code === "42P01") {
          alert("Таблица background_images не существует. Нужно создать её в базе данных.");
        } else {
          alert("Ошибка сохранения фона: " + error.message);
        }
        return;
      }

      setShowForm(false);
      setFormData({
        name: "",
        type: "home",
        category: "",
        overlay_color: "#000000",
        overlay_opacity: 0.5,
        position: "center",
      });
      setImageFile(null);
      setPreviewUrl(null);
      await loadBackgrounds();
    } catch (error) {
      console.error("Error saving background:", error);
      alert("Ошибка сохранения фона");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Создаем превью
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("background_images")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) {
        alert("Ошибка обновления фона: " + error.message);
        return;
      }

      await loadBackgrounds();
    } catch (error) {
      console.error("Error toggling background:", error);
      alert("Ошибка обновления фона");
    }
  };

  const deleteBackground = async (id: string) => {
    if (!confirm("Удалить этот фон?")) return;

    try {
      const { error } = await supabase
        .from("background_images")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Ошибка удаления фона: " + error.message);
        return;
      }

      await loadBackgrounds();
    } catch (error) {
      console.error("Error deleting background:", error);
      alert("Ошибка удаления фона");
    }
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Управление фонами
        </h2>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-surface-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-street">
          Управление фонами ({backgrounds.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          {showForm ? "Отмена" : "+ Фон"}
        </button>
      </div>

      {/* Форма загрузки */}
      {showForm && (
        <div className="border border-surface-border bg-black/50 p-4 rounded mb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Название фона
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
                placeholder="Например: Фон для футболки"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Тип страницы
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as BackgroundImage["type"] })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
              >
                <option value="global">Глобальный (все страницы)</option>
                <option value="home">Главная</option>
                <option value="catalog">Каталог</option>
                <option value="category">Категория</option>
                <option value="reviews">Отзывы</option>
                <option value="contacts">Контакты</option>
                <option value="product">Страница товара</option>
              </select>
            </div>

            {formData.type === "category" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                  Категория
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
                  placeholder="Например: Футболки"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Изображение
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
              />
              <p className="text-[9px] text-muted mt-1">
                Рекомендуемый размер: 1920x1080px или больше для лучшего качества
              </p>
              {previewUrl && (
                <div className="mt-2 relative w-full h-32">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                  <div 
                    className="absolute inset-0 rounded"
                    style={{
                      backgroundColor: formData.overlay_color,
                      opacity: formData.overlay_opacity,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                  Цвет затемнения
                </label>
                <input
                  type="color"
                  value={formData.overlay_color}
                  onChange={(e) => setFormData({ ...formData, overlay_color: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                  Прозрачность ({Math.round(formData.overlay_opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.overlay_opacity}
                  onChange={(e) => setFormData({ ...formData, overlay_opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Позиция
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as BackgroundImage["position"] })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
              >
                <option value="center">По центру</option>
                <option value="top">Сверху</option>
                <option value="bottom">Снизу</option>
                <option value="left">Слева</option>
                <option value="right">Справа</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-gray-200 disabled:bg-gray-500 transition-colors rounded"
            >
              {uploading ? "Загрузка..." : "Сохранить"}
            </button>
          </form>
        </div>
      )}

      {/* Список фонов */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {backgrounds.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">
            Нет загруженных фонов
          </div>
        ) : (
          backgrounds.map((bg) => (
            <div
              key={bg.id}
              className={`border p-3 rounded flex items-start gap-3 ${
                bg.is_active ? "border-red-600 bg-red-600/10" : "border-surface-border bg-black/50"
              }`}
            >
              <div className="w-16 h-16 flex-shrink-0 relative">
                {bg.image_url && (
                  <>
                    <Image
                      src={bg.image_url}
                      alt={bg.name}
                      fill
                      className="object-cover rounded"
                    />
                    <div 
                      className="absolute inset-0 rounded"
                      style={{
                        backgroundColor: bg.overlay_color,
                        opacity: bg.overlay_opacity,
                      }}
                    />
                  </>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white mb-1">{bg.name}</p>
                <p className="text-[10px] text-muted">
                  {bg.type === "category" ? `Категория: ${bg.category}` : `Тип: ${bg.type}`}
                </p>
                <p className="text-[10px] text-muted">
                  Затемнение: {bg.overlay_color} ({Math.round(bg.overlay_opacity * 100)}%)
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => toggleActive(bg.id, !bg.is_active)}
                  className={`text-[10px] font-bold px-2 py-1 rounded border ${
                    bg.is_active
                      ? "text-white border-white"
                      : "text-muted border-surface-border"
                  }`}
                >
                  {bg.is_active ? "Вкл" : "Выкл"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteBackground(bg.id)}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30"
                >
                  ✗
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[10px] text-muted">
        ℹ️ Фоны будут автоматически применяться к соответствующим страницам. Затемнение обеспечит читаемость текста поверх изображения.
      </div>
    </div>
  );
}