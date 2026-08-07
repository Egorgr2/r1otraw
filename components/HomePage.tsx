"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { supabase, type Product, type HomePage } from "@/lib/supabase";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("ПОПУЛЯРНЫЕ");

  useEffect(() => {
    // Сначала получаем настройки главной страницы
    supabase
      .from("home_page")
      .select("*")
      .single()
      .then(({ data: homeData, error: homeError }: { data: HomePage | null; error: any }) => {
        if (!homeError && homeData) {
          setTitle(homeData.title || "ПОПУЛЯРНЫЕ");
          
          // Затем получаем популярные товары
          if (homeData.featured_product_ids && homeData.featured_product_ids.length > 0) {
            supabase
              .from("products")
              .select("*")
              .in("id", homeData.featured_product_ids)
              .then(({ data: productsData, error: productsError }: { data: Product[] | null; error: any }) => {
                if (!productsError && productsData) {
                  setProducts(productsData);
                }
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
        } else {
          // Если нет настроек, берем последние товары
          supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(8)
            .then(({ data, error }: { data: Product[] | null; error: any }) => {
              if (!error && data) {
                setProducts(data);
              }
              setLoading(false);
            });
        }
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold uppercase tracking-street">
          {title}
        </h1>
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-wider text-muted">
            Товары скоро появятся
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
  );
}