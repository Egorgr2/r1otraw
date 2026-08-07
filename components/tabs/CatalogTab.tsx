"use client";

import { useEffect, useState } from "react";
import { FilterToggle } from "@/components/FilterToggle";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { supabase, type Product } from "@/lib/supabase";

export function CatalogTab() {
  const [inStock, setInStock] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("is_available", inStock)
      .order("created_at", { ascending: false })
      .then(({ data, error }: { data: Product[] | null; error: any }) => {
        if (!error) setProducts(data ?? []);
        setLoading(false);
      });
  }, [inStock]);

  return (
    <div>
      <FilterToggle value={inStock} onChange={setInStock} />

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">
            {inStock ? "Нет товаров в наличии" : "Нет товаров под заказ"}
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
