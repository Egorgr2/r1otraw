"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";

export function ProductExportImport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Title", "Brand", "Category", "Price", "Sizes", "Status", "Is Available", "Images"];
    const rows = products.map(p => [
      p.id,
      p.title,
      p.brand || "",
      p.category,
      p.price,
      p.sizes?.join(",") || "",
      p.status || "",
      p.is_available ? "Yes" : "No",
      p.images?.join(",") || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedProducts = JSON.parse(text);

      if (!Array.isArray(importedProducts)) {
        throw new Error("Неверный формат данных");
      }

      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const product of importedProducts) {
        const { error } = await supabase
          .from("products")
          .insert({
            title: product.title,
            brand: product.brand,
            category: product.category,
            price: product.price,
            sizes: product.sizes,
            status: product.status,
            is_available: product.is_available,
            images: product.images,
          });

        if (error) {
          errorCount++;
        } else {
          successCount++;
        }
      }

      alert(`Импорт завершен: ${successCount} успешно, ${errorCount} с ошибками`);
      await loadProducts();
    } catch (error) {
      alert("Ошибка импорта: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-surface-border p-4">
      <h2 className="mb-4 text-xs uppercase tracking-street">
        Экспорт/Импорт товаров
      </h2>

      <div className="space-y-4">
        {/* Экспорт */}
        <div className="border border-surface-border bg-black/50 p-4 rounded">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Экспорт
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportToCSV}
              className="flex-1 bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-gray-200 transition-colors rounded"
            >
              Скачать CSV
            </button>
            <button
              type="button"
              onClick={exportToJSON}
              className="flex-1 bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-gray-200 transition-colors rounded"
            >
              Скачать JSON
            </button>
          </div>
        </div>

        {/* Импорт */}
        <div className="border border-surface-border bg-black/50 p-4 rounded">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Импорт из JSON
          </h3>
          <div className="space-y-3">
            <input
              type="file"
              accept=".json"
              onChange={importFromJSON}
              disabled={loading}
              className="w-full text-[10px] text-white file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-gray-200"
            />
            <p className="text-[10px] text-muted">
              Формат JSON должен соответствовать структуре товаров
            </p>
          </div>
        </div>

        {/* Информация */}
        <div className="text-[10px] text-muted space-y-1">
          <p>📦 Всего товаров: {products.length}</p>
          <p>💾 Экспорт создает резервную копию товаров</p>
          <p>⚠️ Импорт добавляет новые товары (не обновляет существующие)</p>
        </div>
      </div>
    </div>
  );
}