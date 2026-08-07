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

    // Применяем фильтры
    if (filterStatuses.length > 0) {
      if (filterStatuses.includes("available")) {
        query = query.eq("status", "available");
      }
      if (filterStatuses.includes("preorder")) {
        query = query.eq("status", "preorder");
      }
      if (filterStatuses.includes("preorder_long")) {
        query = query.eq("status", "preorder_long");
      }
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
      .then(({ data, error }: { data: Product[] | null; error: any }) => {
        if (!error) setProducts(data ?? []);
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
