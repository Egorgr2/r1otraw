"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdvancedLogin } from "@/components/admin/AdvancedLogin";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import { ReviewUpload } from "@/components/admin/ReviewUpload";
import { BackgroundSettings } from "@/components/admin/BackgroundSettings";
import { BackgroundManager } from "@/components/admin/BackgroundManager";
import { ShopCustomization } from "@/components/admin/ShopCustomization";
import { ActivityLogs } from "@/components/admin/ActivityLogs";
import { Analytics } from "@/components/admin/Analytics";
import { BulkPriceManager } from "@/components/admin/BulkPriceManager";
import { ProductExportImport } from "@/components/admin/ProductExportImport";
import { BackupSystem } from "@/components/admin/BackupSystem";
import { ReviewManagement } from "@/components/admin/ReviewManagement";
import { ProductStatistics } from "@/components/admin/ProductStatistics";
import { PromotionsManager } from "@/components/admin/PromotionsManager";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { BrandManager } from "@/components/admin/BrandManager";
import { InventoryManager } from "@/components/admin/InventoryManager";
import { DuplicateFinder } from "@/components/admin/DuplicateFinder";
import { CustomerManager } from "@/components/admin/CustomerManager";
import { SEOOptimizer } from "@/components/admin/SEOOptimizer";
import { isValidAdminSession, clearAdminSession } from "@/lib/security";
import { supabase, type Product } from "@/lib/supabase";

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<"products" | "reviews" | "backgrounds" | "background_manager" | "customization" | "security" | "logs" | "analytics" | "bulk_prices" | "export_import" | "backup" | "review_management" | "product_stats" | "promotions" | "categories" | "brands" | "inventory" | "duplicates" | "customers" | "seo">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setIsAuthenticated(isValidAdminSession());
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!supabase) {
      console.error("Supabase client not available");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!supabase) {
      console.error("Supabase client not available");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Ошибка удаления товара: " + error.message);
        return;
      }

      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Ошибка удаления товара");
    }
  };

  if (!isAuthenticated) {
    return <AdvancedLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold uppercase tracking-street text-white">
            Админ-панель
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-3 py-2 rounded"
            >
              На сайт
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-3 py-2 rounded"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mx-auto flex max-w-lg flex-col gap-4 mb-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("products")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 ${
                activeSection === "products"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted hover:border-white/50 hover:text-white"
              }`}
            >
              Товары
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("product_stats")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 ${
                activeSection === "product_stats"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted hover:border-white/50 hover:text-white"
              }`}
            >
              Статистика
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("analytics")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 ${
                activeSection === "analytics"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted hover:border-white/50 hover:text-white"
              }`}
            >
              Аналитика
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("bulk_prices")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "bulk_prices"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Цены
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("export_import")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "export_import"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Экспорт
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("promotions")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "promotions"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Акции
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("categories")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "categories"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Категории
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("brands")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "brands"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Бренды
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("inventory")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "inventory"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Инвентарь
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("duplicates")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "duplicates"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Дубликаты
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("customers")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "customers"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Клиенты
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("seo")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "seo"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              SEO
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("backup")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "backup"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Бэкап
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("customization")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "customization"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Кастомизация
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("backgrounds")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "backgrounds"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Фоны
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("security")}
              className={`border py-2.5 text-[10px] uppercase tracking-wider ${
                activeSection === "security"
                  ? "border-white bg-white text-black"
                  : "border-surface-border text-muted"
              }`}
            >
              Безопасность
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto flex max-w-lg flex flex-col gap-6">
          {activeSection === "products" && (
            <>
              <section className="border border-surface-border p-4 transition-all duration-200">
                <ProductForm
                  key={editingProduct?.id ?? "new"}
                  editingProduct={editingProduct}
                  onSaved={() => {
                    setEditingProduct(null);
                    fetchProducts();
                  }}
                  onCancelEdit={() => setEditingProduct(null)}
                />
              </section>

              <section className="border border-surface-border p-4 transition-all duration-200">
                <h2 className="mb-4 text-xs uppercase tracking-street">
                  Товары ({products.length})
                </h2>
                <ProductTable
                  products={products}
                  loading={loading}
                  onEdit={setEditingProduct}
                  onDelete={handleDeleteProduct}
                />
              </section>
            </>
          )}
          {activeSection === "product_stats" && (
            <section className="border border-surface-border p-4">
              <ProductStatistics />
            </section>
          )}
          {activeSection === "analytics" && (
            <section className="border border-surface-border p-4">
              <Analytics />
            </section>
          )}
          {activeSection === "bulk_prices" && (
            <section className="border border-surface-border p-4">
              <BulkPriceManager />
            </section>
          )}
          {activeSection === "export_import" && (
            <section className="border border-surface-border p-4">
              <ProductExportImport />
            </section>
          )}
          {activeSection === "promotions" && (
            <section className="border border-surface-border p-4">
              <PromotionsManager />
            </section>
          )}
          {activeSection === "review_management" && (
            <section className="border border-surface-border p-4">
              <ReviewManagement />
            </section>
          )}
          {activeSection === "reviews" && (
            <section className="border border-surface-border p-4">
              <ReviewUpload />
            </section>
          )}
          {activeSection === "backgrounds" && (
            <section className="border border-surface-border p-4">
              <BackgroundSettings />
            </section>
          )}
          {activeSection === "background_manager" && (
            <section className="border border-surface-border p-4">
              <BackgroundManager />
            </section>
          )}
          {activeSection === "customization" && (
            <section className="border border-surface-border p-4">
              <ShopCustomization />
            </section>
          )}
          {activeSection === "security" && (
            <section className="border border-surface-border p-4">
              <h2 className="mb-4 text-xs uppercase tracking-street">
                Настройки безопасности
              </h2>
              <div className="space-y-4">
                <div className="text-xs text-muted">
                  <p className="mb-2">🔒 Текущая система безопасности:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Хэширование паролей (SHA-256)</li>
                    <li>• Ограничение попыток входа (5 за 15 минут)</li>
                    <li>• Логирование всех действий</li>
                    <li>• Защита сессий (24 часа)</li>
                    <li>• IP-фильтрация (опционально)</li>
                  </ul>
                </div>
              </div>
            </section>
          )}
          {activeSection === "logs" && (
            <section className="border border-surface-border p-4">
              <ActivityLogs />
            </section>
          )}
          {activeSection === "categories" && (
            <section className="border border-surface-border p-4">
              <CategoryManager />
            </section>
          )}
          {activeSection === "brands" && (
            <section className="border border-surface-border p-4">
              <BrandManager />
            </section>
          )}
          {activeSection === "inventory" && (
            <section className="border border-surface-border p-4">
              <InventoryManager />
            </section>
          )}
          {activeSection === "duplicates" && (
            <section className="border border-surface-border p-4">
              <DuplicateFinder />
            </section>
          )}
          {activeSection === "customers" && (
            <section className="border border-surface-border p-4">
              <CustomerManager />
            </section>
          )}
          {activeSection === "seo" && (
            <section className="border border-surface-border p-4">
              <SEOOptimizer />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}