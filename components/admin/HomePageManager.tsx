"use client";

import { useState, useEffect } from "react";
import { supabase, type HomePage, type Product } from "@/lib/supabase";

export function HomePageManager() {
  const [homeSettings, setHomeSettings] = useState<HomePage | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    // Загружаем настройки главной страницы
    supabase
      .from("home_page")
      .select("*")
      .single()
      .then(({ data, error }: { data: HomePage | null; error: any }) => {
        if (!error && data) {
          setHomeSettings(data);
          setTitle(data.title);
          setSelectedProductIds(data.featured_product_ids || []);
        }
        setLoading(false);
      });

    // Загружаем все товары для выбора
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }: { data: Product[] | null; error: any }) => {
        if (!error && data) {
          setProducts(data);
        }
      });
  }, []);

  const handleSave = async () => {
    if (!homeSettings) return;

    setSaving(true);
    const { error } = await supabase
      .from("home_page")
      .update({
        title,
        featured_product_ids: selectedProductIds,
      })
      .eq("id", homeSettings.id);

    setSaving(false);

    if (error) {
      alert("Ошибка сохранения: " + error.message);
    } else {
      alert("Настройки главной страницы сохранены!");
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-muted">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold uppercase tracking-street">
        Главная страница
      </h2>

      <div className="border border-surface-border p-4">
        <label className="block mb-2 text-[10px] uppercase tracking-wider text-muted">
          Заголовок
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
          placeholder="ПОПУЛЯРНЫЕ"
        />
      </div>

      <div className="border border-surface-border p-4">
        <label className="block mb-2 text-[10px] uppercase tracking-wider text-muted">
          Популярные товары (выберите до 8)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {products.slice(0, 16).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => toggleProduct(product.id)}
              className={`flex items-center gap-2 px-3 py-2 border rounded text-xs transition-colors ${
                selectedProductIds.includes(product.id)
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-white hover:border-white/50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedProductIds.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="sr-only"
              />
              <span className="truncate">{product.title}</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted mt-2">
          Выбрано: {selectedProductIds.length}/8
        </p>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-white py-3 text-[10px] font-bold uppercase tracking-street text-black disabled:opacity-40"
      >
        {saving ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  );
}