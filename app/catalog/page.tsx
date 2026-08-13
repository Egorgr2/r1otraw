"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { Sorting } from "@/components/Sorting";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { BackgroundImage } from "@/components/BackgroundImage";
import { supabase, type Product } from "@/lib/supabase";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "R1OTRAW";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setLoading(true);
    
    if (!supabase) {
      console.error("Supabase client not available");
      setProducts([]);
      setLoading(false);
      return;
    }
    
    let query = supabase.from("products").select("*");

    // Фильтрация по категории
    if (category) {
      // Определяем категории для "Вся [тип]" запросов
      const upperClothes = ["Футболка", "Лонгслив", "Худи", "Зипхуди", "Свитер", "Кардиган", "Рубашка", "Пиджак", "Жилет", "Жилетка", "Бомбер", "Куртка", "Майка"];
      const lowerClothes = ["Брюки", "Штаны", "Джинсы", "Шорты"];
      const footwear = ["Кроссовки", "Кеды", "Ботинки"];
      const accessories = ["Сумка", "Ремень", "Кепка", "Шапка", "Очки", "Часы", "Подвеска", "Браслет", "Перчатки", "Шарф"];

      // Если категория содержит "Вся", показываем все товары родительской категории
      if (category.includes("Вся") || category.includes("Все")) {
        if (category === "Вся одежда") {
          // Не фильтруем по категории - показываем все
        } else if (category === "Вся верхняя одежда") {
          query = query.in("category", upperClothes);
        } else if (category === "Вся нижняя одежда") {
          query = query.in("category", lowerClothes);
        } else if (category === "Вся обувь") {
          query = query.in("category", footwear);
        } else if (category === "Все аксессуары") {
          query = query.in("category", accessories);
        } else {
          // Для других категорий "Вся [категория]" убираем префикс
          const parentCategory = category.replace("Вся ", "").replace("Все ", "");
          query = query.eq("category", parentCategory);
        }
      } else {
        query = query.eq("category", category);
      }
    }

    // Применяем фильтры статусов (используем in вместо eq для множественного выбора)
    if (filterStatuses.length > 0) {
      query = query.in("status", filterStatuses);
    }

    // Применяем фильтры брендов
    if (filterBrands.length > 0) {
      query = query.in("brand", filterBrands);
    }

    // Применяем сортировку
    if (sortBy === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sortBy === "price-desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query
      .then(({ data, error }: { data: Product[] | null; error: any }) => {
        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } else {
          setProducts(data ?? []);
        }
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error("Unexpected error:", error);
        setProducts([]);
        setLoading(false);
      });
  }, [category, filterStatuses, filterBrands, sortBy]);

  const categoryTitle = category ? category.toUpperCase() : "ВСЯ ОДЕЖДА";

  return (
    <BackgroundImage page="shop">
      <div className="min-h-screen pb-6">
        <Header shopName={shopName} />
      <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-white hover:text-muted mr-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-street">
          {categoryTitle}
        </h1>
      </div>

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Filters
              onFilterChange={(filters) => {
                setFilterStatuses(filters.statuses);
                setFilterBrands(filters.brands);
              }}
            />
          </div>
          <div className="flex-1">
            <Sorting onSortChange={setSortBy} />
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center px-6 text-center">
            <p className="text-xs uppercase tracking-wider text-muted">
              Нет товаров в этой категории
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
    </BackgroundImage>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <CatalogContent />
    </Suspense>
  );
}