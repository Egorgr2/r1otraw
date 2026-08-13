"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";
import { sanitizeString } from "@/lib/validation";

type ProductSEO = Product & {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

export function SEOOptimizer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<ProductSEO | null>(null);
  const [seoData, setSeoData] = useState({
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        console.error("Supabase client not available");
        setProducts([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSEO = (product: Product) => {
    setEditingProduct(product as ProductSEO);
    setSeoData({
      seo_title: `${product.title} | ${product.brand || "Реплики"} | Купить в R1OTRAW`,
      seo_description: `${product.title} от ${product.brand || "известного бренда"}. Качественная реплика по выгодной цене ${product.price} грн. Размеры: ${product.sizes?.join(", ") || "все размеры"}. Доставка по Украине.`,
      seo_keywords: `${product.title}, ${product.brand || "реплики"}, ${product.category}, купить в Украине, цена ${product.price}`,
    });
  };

  const saveSEO = async () => {
    if (!editingProduct) return;

    try {
      // В реальном приложении нужно добавить поля SEO в таблицу products
      // Сейчас просто сохраняем в localStorage для демонстрации
      const seoDataToSave = {
        productId: editingProduct.id,
        seo_title: seoData.seo_title,
        seo_description: seoData.seo_description,
        seo_keywords: seoData.seo_keywords,
      };

      // Сохраняем в localStorage для демонстрации
      const existingSEO = JSON.parse(localStorage.getItem('product_seo') || '{}');
      existingSEO[editingProduct.id] = seoDataToSave;
      localStorage.setItem('product_seo', JSON.stringify(existingSEO));

      alert(`SEO данные сохранены локально для: ${editingProduct.title}\n\n` +
        `Title: ${seoData.seo_title}\n` +
        `Description: ${seoData.seo_description}\n` +
        `Keywords: ${seoData.seo_keywords}\n\n` +
        `Примечание: Данные сохранены в localStorage. Для сохранения в БД нужно добавить SEO поля в таблицу products.`);
      
      setEditingProduct(null);
      setSeoData({ seo_title: "", seo_description: "", seo_keywords: "" });
    } catch (error) {
      console.error("Error saving SEO:", error);
      alert("Ошибка сохранения SEO данных");
    }
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          SEO оптимизация
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
          SEO оптимизация товаров
        </h2>
        <button
          type="button"
          onClick={loadProducts}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          Обновить
        </button>
      </div>

      {/* Редактор SEO */}
      {editingProduct && (
        <div className="border border-surface-border bg-black/50 p-4 rounded mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Редактирование SEO: {editingProduct.title}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setSeoData({ seo_title: "", seo_description: "", seo_keywords: "" });
              }}
              className="text-[10px] text-muted hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Meta Title (до 60 символов)
              </label>
              <input
                type="text"
                value={seoData.seo_title}
                onChange={(e) => setSeoData({ ...seoData, seo_title: sanitizeString(e.target.value) })}
                maxLength={60}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
              />
              <p className="text-[9px] text-muted mt-1">
                {seoData.seo_title.length}/60 символов
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Meta Description (до 160 символов)
              </label>
              <textarea
                value={seoData.seo_description}
                onChange={(e) => setSeoData({ ...seoData, seo_description: sanitizeString(e.target.value) })}
                maxLength={160}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none h-20"
              />
              <p className="text-[9px] text-muted mt-1">
                {seoData.seo_description.length}/160 символов
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Keywords (через запятую)
              </label>
              <input
                type="text"
                value={seoData.seo_keywords}
                onChange={(e) => setSeoData({ ...seoData, seo_keywords: e.target.value })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={saveSEO}
              className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black"
            >
              Сохранить SEO
            </button>
          </div>
        </div>
      )}

      {/* Список товаров */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {products.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">
            Нет товаров
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="border border-surface-border bg-black/50 p-3 rounded flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-xs font-bold text-white">{product.title}</p>
                <p className="text-[10px] text-muted">
                  {product.brand} • {product.category} • {product.price} ₴
                </p>
              </div>
              <button
                type="button"
                onClick={() => generateSEO(product)}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 px-3 py-1 rounded border border-blue-500/30"
              >
                SEO
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[10px] text-muted">
        ℹ️ Для полноценной SEO оптимизации нужно добавить поля SEO в таблицу products.
        Сейчас показан генератор SEO мета-тегов.
      </div>
    </div>
  );
}