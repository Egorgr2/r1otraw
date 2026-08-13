"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";

type DuplicateGroup = {
  id: string;
  products: Product[];
  similarity: number;
  reason: string;
};

export function DuplicateFinder() {
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const findDuplicates = async () => {
    setScanning(true);
    setLoading(true);
    
    try {
      if (!supabase) {
        console.error("Supabase client not available");
        setDuplicateGroups([]);
        return;
      }
      
      const { data: products, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Error fetching products:", error);
        setDuplicateGroups([]);
        return;
      }

      if (!products) {
        setDuplicateGroups([]);
        return;
      }

      const groups: DuplicateGroup[] = [];
      const processed = new Set<string>();
      const titleMap = new Map<string, Product[]>();

      // Группируем товары по похожим названиям для эффективности
      for (const product of products) {
        const normalizedTitle = product.title.toLowerCase().trim();
        
        if (!titleMap.has(normalizedTitle)) {
          titleMap.set(normalizedTitle, []);
        }
        titleMap.get(normalizedTitle)!.push(product);
      }

      // Ищем дубликаты в каждой группе
      for (const [title, groupProducts] of Array.from(titleMap.entries())) {
        if (groupProducts.length === 1) continue;

        // Проверяем каждую пару в группе
        for (let i = 0; i < groupProducts.length; i++) {
          const product1 = groupProducts[i];
          if (processed.has(product1.id)) continue;

          const duplicates: Product[] = [product1];
          let reason = "";

          for (let j = i + 1; j < groupProducts.length; j++) {
            const product2 = groupProducts[j];
            if (processed.has(product2.id)) continue;

            // Точное совпадение названий
            if (product1.title.toLowerCase() === product2.title.toLowerCase()) {
              duplicates.push(product2);
              processed.add(product2.id);
              reason = "Идентичные названия";
            }
            // Проверка на одинаковые цены и категории
            else if (
              product1.price === product2.price &&
              product1.category === product2.category &&
              product1.brand === product2.brand
            ) {
              duplicates.push(product2);
              processed.add(product2.id);
              reason = "Одинаковые цена, категория и бренд";
            }
          }

          if (duplicates.length > 1) {
            groups.push({
              id: `group_${groups.length}`,
              products: duplicates,
              similarity: 1,
              reason,
            });
          }

          processed.add(product1.id);
        }
      }

      setDuplicateGroups(groups);
    } catch (error) {
      console.error("Error finding duplicates:", error);
      alert("Ошибка поиска дубликатов");
      setDuplicateGroups([]);
    } finally {
      setScanning(false);
      setLoading(false);
    }
  };

  const mergeProducts = async (keepProductId: string, deleteProductIds: string[]) => {
    if (!confirm(`Удалить ${deleteProductIds.length} товаров и оставить только один?`)) {
      return;
    }

    if (!supabase) {
      alert("Ошибка подключения к базе данных");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", deleteProductIds);

      if (error) throw error;

      // Удаляем группу из списка
      setDuplicateGroups(prev => prev.filter(group => 
        !group.products.some(p => deleteProductIds.includes(p.id))
      ));

      alert("Товары успешно объединены");
    } catch (error) {
      console.error("Error merging products:", error);
      alert("Ошибка объединения товаров");
    }
  };

  return (
    <div className="border border-surface-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-street">
          Поиск дубликатов
        </h2>
        <button
          type="button"
          onClick={findDuplicates}
          disabled={scanning}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded disabled:opacity-40"
        >
          {scanning ? "Поиск..." : "Найти дубликаты"}
        </button>
      </div>

      {loading && !scanning ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
        </div>
      ) : duplicateGroups.length === 0 && !loading ? (
        <div className="text-center py-8 text-xs text-muted">
          Нажмите &quot;Найти дубликаты&quot; для поиска повторяющихся товаров
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {duplicateGroups.map((group) => (
            <div
              key={group.id}
              className="border border-yellow-500/30 bg-yellow-500/10 p-4 rounded"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-bold text-yellow-400">
                    Найдено {group.products.length} дубликатов
                  </p>
                  <p className="text-[10px] text-muted">
                    Причина: {group.reason}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const keepId = group.products[0].id;
                    const deleteIds = group.products.slice(1).map(p => p.id);
                    mergeProducts(keepId, deleteIds);
                  }}
                  className="text-[10px] font-bold text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                >
                  Объединить
                </button>
              </div>

              <div className="space-y-2">
                {group.products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`border p-2 rounded flex items-center justify-between ${
                      index === 0
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{product.title}</p>
                      <p className="text-[10px] text-muted">
                        {product.brand} • {product.category} • {product.price} ₴
                      </p>
                    </div>
                    {index === 0 && (
                      <span className="text-[10px] text-green-400 font-bold">
                        ✓ Оставить
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-[10px] text-muted">
        ℹ️ Дубликаты ищутся по названию, цене, категории и бренду. 
        Объединение удаляет все товары кроме первого в группе.
      </div>
    </div>
  );
}