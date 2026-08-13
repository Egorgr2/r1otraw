"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";

export function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5); // Порог низкого запаса

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        console.error("Supabase client not available");
        setProducts([]);
        setLowStockProducts([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setLowStockProducts([]);
        return;
      }

      if (data) {
        setProducts(data);
        // Для демо используем статус для определения "низкого запаса"
        // В реальном приложении должно быть поле quantity/stock
        const lowStock = data.filter((p: Product) => !p.is_available || p.status === "preorder_long");
        setLowStockProducts(lowStock);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setLowStockProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    if (!supabase) {
      alert("Ошибка подключения к базе данных");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({ is_available: !currentStatus })
        .eq("id", productId);

      if (error) throw error;

      await loadProducts();
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Ошибка обновления доступности");
    }
  };

  const updateStatus = async (productId: string, newStatus: string) => {
    if (!supabase) {
      alert("Ошибка подключения к базе данных");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({ status: newStatus })
        .eq("id", productId);

      if (error) throw error;

      await loadProducts();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Ошибка обновления статуса");
    }
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Управление инвентарем
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
          Управление инвентарем
        </h2>
        <button
          type="button"
          onClick={loadProducts}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          Обновить
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Всего товаров
          </p>
          <p className="text-2xl font-bold text-white">
            {products.length}
          </p>
        </div>
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            В наличии
          </p>
          <p className="text-2xl font-bold text-green-400">
            {products.filter((p: Product) => p.is_available).length}
          </p>
        </div>
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Недоступно
          </p>
          <p className="text-2xl font-bold text-red-400">
            {products.filter((p: Product) => !p.is_available).length}
          </p>
        </div>
      </div>

      {/* Предупреждения о низком запасе */}
      {lowStockProducts.length > 0 && (
        <div className="border border-red-500/30 bg-red-500/10 p-4 rounded mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3">
            ⚠️ Требуют внимания ({lowStockProducts.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="border border-red-500/20 bg-black/50 p-2 rounded flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{product.title}</p>
                  <p className="text-[10px] text-muted">
                    {product.brand} • {product.category}
                  </p>
                </div>
                <div className="flex gap-1">
                  <select
                    value={product.status}
                    onChange={(e) => updateStatus(product.id, e.target.value)}
                    className="text-[10px] bg-black border border-surface-border text-white px-2 py-1 rounded"
                  >
                    <option value="available">В наличии</option>
                    <option value="preorder">Подзаказ</option>
                    <option value="preorder_long">Предзаказ</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Все товары */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
          Все товары
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className={`border p-3 rounded flex items-center justify-between ${
                !product.is_available
                  ? "border-red-500/30 bg-red-500/10"
                  : "border-surface-border bg-black/50"
              }`}
            >
              <div className="flex-1">
                <p className="text-xs font-bold text-white">{product.title}</p>
                <p className="text-[10px] text-muted">
                  {product.brand} • {product.category} • {product.price} ₴
                </p>
                <p className="text-[10px] text-muted">
                  Статус: {
                    product.status === "available" ? "В наличии" :
                    product.status === "preorder" ? "Подзаказ" :
                    product.status === "preorder_long" ? "Предзаказ" : product.status
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleAvailability(product.id, product.is_available)}
                  className={`text-[10px] font-bold px-3 py-1 rounded border ${
                    product.is_available
                      ? "text-green-400 border-green-500/30"
                      : "text-red-400 border-red-500/30"
                  }`}
                >
                  {product.is_available ? "✓ В наличии" : "✗ Нет"}
                </button>
                <select
                  value={product.status}
                  onChange={(e) => updateStatus(product.id, e.target.value)}
                  className="text-[10px] bg-black border border-surface-border text-white px-2 py-1 rounded"
                >
                  <option value="available">В наличии</option>
                  <option value="preorder">Подзаказ</option>
                  <option value="preorder_long">Предзаказ</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-[10px] text-muted">
        ℹ️ Инвентарь управляется через статусы товаров. 
        &quot;В наличии&quot; - товар доступен, &quot;Подзаказ&quot; - ограниченное количество, &quot;Предзаказ&quot; - нет в наличии.
      </div>
    </div>
  );
}