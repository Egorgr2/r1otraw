import Link from "next/link";
import { getProductImages, type Product } from "@/lib/supabase";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const images = getProductImages(product);
  const sizes = product.sizes ?? [];

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col active:opacity-80"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-raised border border-surface-border">
        {images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105 group-active:scale-[0.98]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Нет фото
          </div>
        )}
        {product.is_new && (
          <span className="absolute left-2 top-2 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black rounded">
            NEW
          </span>
        )}
        {!product.is_available && (
          <span className="absolute right-2 top-2 bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white rounded">
            Под заказ
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <h3 className="line-clamp-2 text-xs font-medium uppercase tracking-wide">
          {product.title}
        </h3>
        <p className="text-sm font-bold">{product.price} ₴</p>
        
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sizes.map((size) => (
              <span
                key={size}
                className="w-6 h-6 flex items-center justify-center text-[10px] font-bold border rounded bg-white text-black"
              >
                {size}
              </span>
            ))}
          </div>
        )}
        
        <button className="mt-1 w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-gray-200 active:bg-gray-300 rounded">
          Подробнее
        </button>
      </div>
    </Link>
  );
}
