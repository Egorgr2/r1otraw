import Link from "next/link";
import { formatSizes, getProductImages, type Product } from "@/lib/supabase";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const images = getProductImages(product);
  const sizesText = formatSizes(product.sizes);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col active:opacity-80"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-raised">
        {images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-active:scale-[0.98]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Нет фото
          </div>
        )}
        {product.is_new && (
          <span className="absolute left-2 top-2 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
            NEW
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-0.5">
        <h3 className="line-clamp-2 text-xs uppercase tracking-wide">
          {product.title}
        </h3>
        <p className="text-sm font-medium">{product.price} ₴</p>
        {sizesText && (
          <p className="text-[10px] text-muted">{sizesText}</p>
        )}
      </div>
    </Link>
  );
}
