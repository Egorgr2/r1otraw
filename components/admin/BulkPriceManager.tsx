"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";

export function BulkPriceManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [priceChange, setPriceChange] = useState("");
  const [priceChangeType, setPriceChangeType] = useState<"absolute" | "percentage">("absolute");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(Array.from(products.map(p => p.id))));
    }
  };

  const applyPriceChange = async () => {
    if (selectedProducts.size === 0 || !priceChange) {
      alert("Выберите товары и укажите изменение цены");
      return;
    }

    if (!confirm(`Вы уверены, что хотите изменить цены для ${selectedProducts.size} товаров?`)) {
      return;
    }

    setUpdating(true);
    const changeValue = parseFloat(priceChange);

    try {
      // Подготавливаем все обновления
      const updates = Array.from(selectedProducts).map(productId => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;

        let newPrice: number;
        if (priceChangeType === "absolute") {
          newPrice = product.price + changeValue;
        } else {
          newPrice = product.price * (1 + changeValue / 100);
        }

        newPrice = Math.max(0, Math.round(newPrice));

        return supabase
          .from("products")
          .update({ price: newPrice })
          .eq("id", productId);
      }).filter(Boolean);

      // Выполняем все обновления параллельно
      await Promise.all(updates);
      
      await loadProducts();
      setSelectedProducts(new Set());
      setPriceChange("");
      alert("Цены обновлены!");
    } catch (error) {
      console.error("Error updating prices:", error);
      alert("Ошибка при обновлении цен");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Массовое изменение цен
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
      <h2 className="mb-4 text-xs uppercase tracking-street">
        Массовое изменение цен
      </h2>

      {/* Панель управления */}
      <div className="border border-surface-border bg-black/50 p-4 rounded mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white">
            Выбрано: {selectedProducts.size} из {products.length}
          </p>
          <button
            type="button"
            onClick={selectAll}
            className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
          >
            {selectedProducts.size === products.length ? "Снять все" : "Выбрать все"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
              Тип изменения
            </label>
            <select
              value={priceChangeType}
              onChange={(e) => setPriceChangeType(e.target.value as "absolute" | "percentage")}
              className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
            >
              <option value="absolute">Фиксированная сумма (₴)</option>
              <option value="percentage">Процент (%)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
              {priceChangeType === "absolute" ? "Сумма (₴)" : "Проент (%)"}
            </label>
            <input
              type="number"
              value={priceChange}
              onChange={(e) => setPriceChange(e.target.value)}
              placeholder={priceChangeType === "absolute" ? "+100" : "+10"}
              className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={applyPriceChange}
          disabled={updating || selectedProducts.size === 0 || !priceChange}
          className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black disabled:opacity-40"
        >
          {updating ? "Обновление..." : "Применить"}
        </button>
      </div>

      {/* Список товаров */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border p-3 rounded cursor-pointer transition-colors ${
              selectedProducts.has(product.id)
                ? "border-white bg-white/10"
                : "border-surface-border bg-black/50"
            }`}
            onClick={() => toggleProduct(product.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-white mb-1">
                  {product.title}
                </p>
                <p className="text-[10px] text-muted">
                  {product.brand} • {product.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  {product.price} ₴
                </p>
                {selectedProducts.has(product.id) && (
                  <p className="text-[10px] text-green-400">
                    ✓ Выбран
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}