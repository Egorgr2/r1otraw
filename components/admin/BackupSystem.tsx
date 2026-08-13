"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function BackupSystem() {
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const createBackup = async () => {
    setBackingUp(true);
    try {
      // Получаем все данные из таблиц
      const [products, reviews, settings, analytics] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("reviews").select("*"),
        supabase.from("shop_settings").select("*"),
        supabase.from("background_settings").select("*"),
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        products: products.data || [],
        reviews: reviews.data || [],
        shop_settings: settings.data || [],
        background_settings: analytics.data || [],
      };

      const jsonContent = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `backup_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Бэкап создан успешно!");
    } catch (error) {
      alert("Ошибка создания бэкапа: " + (error as Error).message);
    } finally {
      setBackingUp(false);
    }
  };

  const restoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm("⚠️ Внимание! Это перезапишет существующие данные. Продолжить?")) {
      return;
    }

    setRestoring(true);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.products || !Array.isArray(backup.products)) {
        throw new Error("Неверный формат бэкапа");
      }

      // Подготавливаем все upsert операции
      const productUpdates = backup.products.map((product: any) =>
        supabase.from("products").upsert({
          id: product.id,
          title: product.title,
          brand: product.brand,
          category: product.category,
          price: product.price,
          sizes: product.sizes,
          status: product.status,
          is_available: product.is_available,
          images: product.images,
        })
      );

      // Выполняем все upsert операции параллельно
      await Promise.all(productUpdates);

      // Восстанавливаем отзывы если есть
      if (backup.reviews && Array.isArray(backup.reviews)) {
        const reviewUpdates = backup.reviews.map((review: any) =>
          supabase.from("reviews").upsert({
            id: review.id,
            customer_name: review.customer_name,
            rating: review.rating,
            text: review.text,
            date: review.date,
          })
        );
        await Promise.all(reviewUpdates);
      }

      alert("Бэкап восстановлен успешно!");
    } catch (error) {
      console.error("Error restoring backup:", error);
      alert("Ошибка восстановления: " + (error as Error).message);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="border border-surface-border p-4">
      <h2 className="mb-4 text-xs uppercase tracking-street">
        Система бэкапов
      </h2>

      <div className="space-y-4">
        {/* Создание бэкапа */}
        <div className="border border-surface-border bg-black/50 p-4 rounded">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Создать бэкап
          </h3>
          <button
            type="button"
            onClick={createBackup}
            disabled={backingUp}
            className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black disabled:opacity-40"
          >
            {backingUp ? "Создание..." : "Скачать бэкап"}
          </button>
          <p className="text-[10px] text-muted mt-2">
            Создает полную копию всех данных (товары, отзывы, настройки)
          </p>
        </div>

        {/* Восстановление бэкапа */}
        <div className="border border-surface-border bg-black/50 p-4 rounded">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Восстановить бэкап
          </h3>
          <input
            type="file"
            accept=".json"
            onChange={restoreBackup}
            disabled={restoring}
            className="w-full text-[10px] text-white file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-gray-200"
          />
          <p className="text-[10px] text-red-400 mt-2">
            ⚠️ Внимание: Это перезапишет существующие данные!
          </p>
        </div>

        {/* Информация */}
        <div className="text-[10px] text-muted space-y-1">
          <p>💾 Бэкапы сохраняются как JSON файлы</p>
          <p>🔄 Восстановление обновляет существующие данные</p>
          <p>📅 Рекомендуется создавать бэкап перед массовыми изменениями</p>
        </div>
      </div>
    </div>
  );
}