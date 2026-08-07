"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WebApp from "@twa-dev/sdk";
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

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError(true);
        } else {
          setProduct(data);
          if (data.sizes?.length === 1) {
            setSelectedSize(data.sizes[0]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleOrder = () => {
    if (!product) return;

    const size = selectedSize ?? "не указан";
    const text = encodeURIComponent(
      `Привет, Хочу заказать: ${product.title}, размер: ${size}, цена: ${product.price}₴`
    );
    WebApp.openTelegramLink(`https://t.me/${sellerUsername}?text=${text}`);
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
    <div className="min-h-screen pb-8">
      <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-street text-muted"
        >
          ← Назад
        </Link>
      </div>

      <ProductGallery images={images} title={product.title} />

      <div className="flex flex-col gap-4 px-4 py-5">
        <div>
          <h1 className="text-sm font-medium uppercase tracking-wide">
            {product.title}
          </h1>
          <p className="mt-1 text-lg font-medium">{product.price} ₴</p>
        </div>

        {(product.brand || product.category) && (
          <div className="flex flex-col gap-1 text-xs text-muted">
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

        <SizeSelector
          sizes={sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />

        <button
          type="button"
          onClick={handleOrder}
          disabled={sizes.length > 0 && !selectedSize}
          className="mt-2 w-full bg-white py-4 text-[11px] font-bold uppercase tracking-street text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40 active:opacity-80"
        >
          ЗАМОВИТИ
        </button>
      </div>
    </div>
  );
}
