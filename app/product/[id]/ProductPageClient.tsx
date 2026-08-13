"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductGallery } from "@/components/ProductGallery";
import { SizeSelector } from "@/components/SizeSelector";
import { ProductPageSkeleton } from "@/components/ui/Skeleton";
import { BackgroundImage } from "@/components/BackgroundImage";
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
  const [WebApp, setWebApp] = useState<typeof import("@twa-dev/sdk").default | null>(null);
  const router = useRouter();
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "R1OTRAW";

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
    <BackgroundImage page="shop">
      <div className="min-h-screen pb-8">
        <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-white hover:text-muted mr-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <Link
          href="/"
          className="text-sm font-medium uppercase tracking-street text-white hover:text-muted"
        >
          {shopName}
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Левая колонка - галерея */}
          <div className="md:sticky md:top-20 md:self-start">
            <ProductGallery images={images} title={product.title} />
          </div>

          {/* Правая колонка - информация */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                  {product.title}
                </h1>
                {product.brand && (
                  <p className="mt-2 text-sm font-bold uppercase tracking-wider text-muted">
                    {product.brand}
                  </p>
                )}
                <p className="mt-3 text-3xl md:text-4xl font-bold">{product.price} ₴</p>
              </div>
              {product.is_new && (
                <span className="bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black rounded hidden md:block">
                  NEW
                </span>
              )}
            </div>

            {/* Mobile NEW badge */}
            {product.is_new && (
              <span className="bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black rounded md:hidden w-fit">
                NEW
              </span>
            )}

            {product.category && (
              <div className="flex flex-wrap gap-4 text-sm text-muted">
                <p>
                  <span className="uppercase tracking-wider">Категория: </span>
                  {product.category}
                </p>
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
              className="w-full bg-white py-4 text-[12px] md:text-sm font-bold uppercase tracking-street text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40 active:opacity-80 rounded-lg"
            >
              ЗАКАЗАТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
    </BackgroundImage>
  );
}
