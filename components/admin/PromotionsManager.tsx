"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase, type Product } from "@/lib/supabase";

type Promotion = {
  id: string;
  name: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  applicable_categories: string[];
  applicable_brands: string[];
  active: boolean;
};

export function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    discount_percent: "",
    start_date: "",
    end_date: "",
    applicable_categories: [] as string[],
    applicable_brands: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [promosData, productsData] = await Promise.all([
        supabase.from("promotions").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*"),
      ]);
      
      if (promosData.error) {
        console.log("Promotions table may not exist");
        setPromotions([]);
      } else {
        setPromotions(promosData.data || []);
      }
      
      if (productsData.error) {
        console.error("Error fetching products:", productsData.error);
        setProducts([]);
      } else {
        setProducts(productsData.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setPromotions([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async () => {
    if (!formData.name || !formData.discount_percent || !formData.start_date || !formData.end_date) {
      alert("Заполните все обязательные поля");
      return;
    }

    const { error } = await supabase.from("promotions").insert({
      name: formData.name,
      discount_percent: parseFloat(formData.discount_percent),
      start_date: formData.start_date,
      end_date: formData.end_date,
      applicable_categories: formData.applicable_categories,
      applicable_brands: formData.applicable_brands,
      active: true,
    });

    if (error) {
      if (error.code === "42P01") {
        alert("Таблица promotions не существует. Нужно создать её в базе данных.");
      } else {
        alert("Ошибка создания акции: " + error.message);
      }
      return;
    }

    setShowForm(false);
    setFormData({
      name: "",
      discount_percent: "",
      start_date: "",
      end_date: "",
      applicable_categories: [],
      applicable_brands: [],
    });
    await loadData();
  };

  const togglePromotion = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("promotions")
        .update({ active })
        .eq("id", id);

      if (error) {
        alert("Ошибка обновления акции: " + error.message);
        return;
      }

      await loadData();
    } catch (error) {
      console.error("Error toggling promotion:", error);
      alert("Ошибка обновления акции");
    }
  };

  const deletePromotion = async (id: string) => {
    if (!confirm("Удалить эту акцию?")) return;

    try {
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Ошибка удаления акции: " + error.message);
        return;
      }

      await loadData();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      alert("Ошибка удаления акции");
    }
  };

  const categories = useMemo(() => 
    Array.from(new Set(products.map(p => p.category).filter((c): c is string => c !== null))),
    [products]
  );
  const brands = useMemo(() => 
    Array.from(new Set(products.map(p => p.brand).filter((b): b is string => b !== null))),
    [products]
  );

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      applicable_categories: prev.applicable_categories.includes(category)
        ? prev.applicable_categories.filter(c => c !== category)
        : [...prev.applicable_categories, category]
    }));
  };

  const toggleBrand = (brand: string) => {
    setFormData(prev => ({
      ...prev,
      applicable_brands: prev.applicable_brands.includes(brand)
        ? prev.applicable_brands.filter(b => b !== brand)
        : [...prev.applicable_brands, brand]
    }));
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Управление акциями
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
          Управление акциями ({promotions.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          {showForm ? "Отмена" : "+ Создать"}
        </button>
      </div>

      {/* Форма создания */}
      {showForm && (
        <div className="border border-surface-border bg-black/50 p-4 rounded mb-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Название акции
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Скидка (%)
              </label>
              <input
                type="number"
                value={formData.discount_percent}
                onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                  Начало
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                  Конец
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Категории
              </label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {categories.filter(Boolean).map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`text-[10px] px-2 py-1 rounded border ${
                      formData.applicable_categories.includes(category)
                        ? "border-white bg-white text-black"
                        : "border-surface-border text-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Бренды
              </label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {brands.filter(Boolean).map(brand => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={`text-[10px] px-2 py-1 rounded border ${
                      formData.applicable_brands.includes(brand)
                        ? "border-white bg-white text-black"
                        : "border-surface-border text-muted"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={createPromotion}
              className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black"
            >
              Создать акцию
            </button>
          </div>
        </div>
      )}

      {/* Список акций */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {promotions.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">
            Нет активных акций
          </div>
        ) : (
          promotions.map((promo) => (
            <div
              key={promo.id}
              className={`border p-3 rounded ${
                promo.active
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-surface-border bg-black/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-white mb-1">
                    {promo.name}
                  </p>
                  <p className="text-[10px] text-green-400 font-bold">
                    -{promo.discount_percent}%
                  </p>
                  <p className="text-[10px] text-muted">
                    {new Date(promo.start_date).toLocaleDateString("ru-RU")} - {new Date(promo.end_date).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => togglePromotion(promo.id, !promo.active)}
                    className={`text-[10px] font-bold px-2 py-1 rounded border ${
                      promo.active
                        ? "text-green-400 border-green-500/30"
                        : "text-muted border-surface-border"
                    }`}
                  >
                    {promo.active ? "Вкл" : "Выкл"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePromotion(promo.id)}
                    className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30"
                  >
                    ✗
                  </button>
                </div>
              </div>

              {promo.applicable_categories.length > 0 && (
                <div className="text-[10px] text-muted">
                  Категории: {promo.applicable_categories.join(", ")}
                </div>
              )}
              {promo.applicable_brands.length > 0 && (
                <div className="text-[10px] text-muted">
                  Бренды: {promo.applicable_brands.join(", ")}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}