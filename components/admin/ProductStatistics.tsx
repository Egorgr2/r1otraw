"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";

export function ProductStatistics() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    byCategory: {} as Record<string, number>,
    byBrand: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    averagePrice: 0,
    priceRange: { min: 0, max: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const { data: products } = await supabase
      .from("products")
      .select("*");

    if (products) {
      const byCategory: Record<string, number> = {};
      const byBrand: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      let totalPrice = 0;
      let minPrice = Infinity;
      let maxPrice = 0;

      products.forEach((product: Product) => {
        // По категориям
        if (product.category) {
          byCategory[product.category] = (byCategory[product.category] || 0) + 1;
        }

        // По брендам
        if (product.brand) {
          byBrand[product.brand] = (byBrand[product.brand] || 0) + 1;
        }

        // По статусу
        if (product.status) {
          byStatus[product.status] = (byStatus[product.status] || 0) + 1;
        }

        // Цены
        totalPrice += product.price;
        minPrice = Math.min(minPrice, product.price);
        maxPrice = Math.max(maxPrice, product.price);
      });

      setStats({
        totalProducts: products.length,
        byCategory,
        byBrand,
        byStatus,
        averagePrice: products.length > 0 ? Math.round(totalPrice / products.length) : 0,
        priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
      });
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Статистика товаров
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
          Статистика товаров
        </h2>
        <button
          type="button"
          onClick={loadStats}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          Обновить
        </button>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Всего товаров
          </p>
          <p className="text-2xl font-bold text-white">
            {stats.totalProducts}
          </p>
        </div>
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Средняя цена
          </p>
          <p className="text-2xl font-bold text-white">
            {stats.averagePrice} ₴
          </p>
        </div>
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Мин. цена
          </p>
          <p className="text-2xl font-bold text-white">
            {stats.priceRange.min} ₴
          </p>
        </div>
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Макс. цена
          </p>
          <p className="text-2xl font-bold text-white">
            {stats.priceRange.max} ₴
          </p>
        </div>
      </div>

      {/* По категориям */}
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
          По категориям
        </h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {Object.entries(stats.byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => (
            <div key={category} className="flex items-center justify-between text-[10px]">
              <span className="text-white">{category}</span>
              <span className="text-muted">{count} шт</span>
            </div>
          ))}
        </div>
      </div>

      {/* По брендам */}
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
          По брендам
        </h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {Object.entries(stats.byBrand)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([brand, count]) => (
            <div key={brand} className="flex items-center justify-between text-[10px]">
              <span className="text-white">{brand}</span>
              <span className="text-muted">{count} шт</span>
            </div>
          ))}
        </div>
      </div>

      {/* По статусу */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
          По статусу
        </h3>
        <div className="space-y-2">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between text-[10px]">
              <span className="text-white">
                {status === "available" && "В наличии"}
                {status === "preorder" && "Подзаказ"}
                {status === "preorder_long" && "Предзаказ"}
              </span>
              <span className="text-muted">{count} шт</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}