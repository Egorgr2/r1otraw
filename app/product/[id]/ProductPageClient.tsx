"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGallery } from "@/components/ProductGallery";
import { SizeSelector } from "@/components/SizeSelector";
import { ProductPageSkeleton } from "@/components/ui/Skeleton";
import { getProductImages, supabase, type Product } from "@/lib/supabase";

type ProductPageClientProps = {
  productId: string;
  sellerUsername: string;
};

export function ProductPageClient({
  productId,
  sellerUsername,
}: ProductPageClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [WebApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      setWebApp(module.default);
    });
  }, []);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()
      .then(({ data, error: fetchError }: { data: Product | null; error: any }) => {
        if (fetchError || !data) {
          setError(true);
        } else {
          setProduct(data);
          if (data.sizes?.length === 1) {
            setSelectedSize(data.sizes[0]);
          }
        }
        setLoading(false);
      });
  }, [productId]);

  const handleOrder = () => {
    if (!product) return;

    const size = selectedSize ?? "не указан";
    const text = encodeURIComponent(
      `Привет, хочу заказать: ${product.title}, размер: ${size}, цена: ${product.price}₴`
    );
    
    if (WebApp) {
      WebApp.openTelegramLink(`https://t.me/${sellerUsername}?text=${text}`);
    } else {
      window.open(`https://t.me/${sellerUsername}?text=${text}`, "_blank");
    }
  };

  if (loading) return <ProductPageSkeleton />;

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <p className="text-xs uppercase tracking-wider text-muted">
          Товар не найден
        </p>
        <Link
          href="/"
          className="text-[10px] uppercase tracking-street underline"
        >
          В каталог
        </Link>
      </div>
    );
  }

  const images = getProductImages(product);
  const sizes = product.sizes ?? [];

  return (
    <div className="min-h-screen pb-8 bg-black">
      <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-street text-muted"
        >
          ← Назад
        </Link>
      </div>

      <ProductGallery images={images} title={product.title} />

      <div className="flex flex-col gap-6 px-4 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-base font-bold uppercase tracking-wide">
              {product.title}
            </h1>
            <p className="mt-2 text-2xl font-bold">{product.price} ₴</p>
          </div>
          {product.is_new && (
            <span className="bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black rounded">
              NEW
            </span>
          )}
        </div>

        {(product.brand || product.category) && (
          <div className="flex gap-4 text-xs text-muted">
            {product.brand && (
              <p>
                <span className="uppercase tracking-wider">Бренд: </span>
                {product.brand}
              </p>
            )}
            {product.category && (
              <p>
                <span className="uppercase tracking-wider">Категория: </span>
                {product.category}
              </p>
            )}
          </div>
        )}

        <div className="border-t border-surface-border pt-6">
          <SizeSelector
            sizes={sizes}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>

        <button
          type="button"
          onClick={handleOrder}
          disabled={sizes.length > 0 && !selectedSize}
          className="w-full bg-white py-4 text-[12px] font-bold uppercase tracking-street text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40 active:opacity-80 rounded-lg"
        >
          ЗАКАЗАТЬ
        </button>
      </div>
    </div>
  );
}
