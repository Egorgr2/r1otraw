"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isValidImageUrl, sanitizeString } from "@/lib/validation";

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
};

export function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo_url: "",
    description: "",
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        console.error("Supabase client not available");
        setBrands([]);
        return;
      }
      
      // Получаем уникальные бренды из товаров
      const { data: products, error } = await supabase
        .from("products")
        .select("brand");

      if (error) {
        console.error("Error fetching products:", error);
        setBrands([]);
        return;
      }

      if (products) {
        const uniqueBrands = Array.from(
          new Set(products.map((p: { brand: string | null }) => p.brand).filter((b: string | null): b is string => b !== null))
        ) as string[];
        
        const brandObjects = uniqueBrands.map((name, index) => ({
          id: `brand_${index}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          logo_url: null,
          description: null,
          created_at: new Date().toISOString(),
        }));

        setBrands(brandObjects);
      }
    } catch (error) {
      console.error("Error loading brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Введите название бренда");
      return;
    }

    if (!supabase) {
      alert("Ошибка подключения к базе данных");
      return;
    }

    try {
      if (editingBrand) {
        // Обновляем бренд (обновляем товары с этим брендом)
        const { error } = await supabase
          .from("products")
          .update({ brand: formData.name })
          .eq("brand", editingBrand.name);

        if (error) throw error;
      } else {
        // Добавляем новый бренд (это просто список из товаров)
        alert("Бренды создаются автоматически на основе товаров");
      }

      setShowForm(false);
      setEditingBrand(null);
      setFormData({ name: "", slug: "", logo_url: "", description: "" });
      await loadBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Ошибка сохранения бренда");
    }
  };

  const deleteBrand = async (brandName: string) => {
    if (!confirm(`Удалить бренд "${brandName}"? Все товары с этим брендом будут помечены как без бренда.`)) {
      return;
    }

    if (!supabase) {
      alert("Ошибка подключения к базе данных");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({ brand: null })
        .eq("brand", brandName);

      if (error) throw error;

      await loadBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Ошибка удаления бренда");
    }
  };

  const editBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo_url: brand.logo_url || "",
      description: brand.description || "",
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Управление брендами
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
          Управление брендами ({brands.length})
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingBrand(null);
            setFormData({ name: "", slug: "", logo_url: "", description: "" });
            setShowForm(!showForm);
          }}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          {showForm ? "Отмена" : "+ Бренд"}
        </button>
      </div>

      {/* Форма создания/редактирования */}
      {showForm && (
        <div className="border border-surface-border bg-black/50 p-4 rounded mb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Название бренда
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: sanitizeString(e.target.value) })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
                placeholder="Например: Nike"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                URL логотипа (опционально)
              </label>
              <input
                type="text"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Описание (опционально)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: sanitizeString(e.target.value) })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none h-20"
                placeholder="Описание бренда..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black"
            >
              {editingBrand ? "Обновить" : "Создать"}
            </button>
          </form>
        </div>
      )}

      {/* Список брендов */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {brands.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">
            Нет брендов
          </div>
        ) : (
          brands.map((brand) => (
            <div
              key={brand.id}
              className="border border-surface-border bg-black/50 p-3 rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {brand.logo_url && isValidImageUrl(brand.logo_url) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="w-8 h-8 object-contain rounded"
                  />
                )}
                <div>
                  <p className="text-xs font-bold text-white">{brand.name}</p>
                  {brand.description && (
                    <p className="text-[10px] text-muted truncate max-w-48">
                      {brand.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => editBrand(brand)}
                  className="text-[10px] font-bold text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500/30"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => deleteBrand(brand.name)}
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
        ℹ️ Бренды создаются автоматически на основе товаров. 
        Изменение бренда обновит все товары с этим брендом.
      </div>
    </div>
  );
}