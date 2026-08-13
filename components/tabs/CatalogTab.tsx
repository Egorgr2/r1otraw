"use client";

import { useEffect, useState } from "react";
import { Filters } from "@/components/Filters";
import { Sorting } from "@/components/Sorting";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { supabase, type Product } from "@/lib/supabase";

export function CatalogTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setLoading(true);
    
    let query = supabase.from("products").select("*");

    // Применяем фильтры статусов (используем in вместо eq для множественного выбора)
    if (filterStatuses.length > 0) {
      query = query.in("status", filterStatuses);
    }

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
      .then(({ data, error }: { data: Product[] | null; error: { message: string } | null }) => {
        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } else {
          setProducts(data ?? []);
        }
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Unexpected error:", error);
        setProducts([]);
        setLoading(false);
      });
  }, [filterStatuses, filterBrands, sortBy]);

  return (
    <div>
      <Sorting onSortChange={setSortBy} />
      <Filters
        onFilterChange={(filters) => {
          setFilterStatuses(filters.statuses);
          setFilterBrands(filters.brands);
        }}
      />

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">
            Нет товаров по выбранным фильтрам
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
