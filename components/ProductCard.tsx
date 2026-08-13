import Link from "next/link";
import { getProductImages, type Product } from "@/lib/supabase";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const images = getProductImages(product);
  const sizes = product.sizes ?? [];

  const statusColors = {
    available: "bg-black text-white border border-white",
    soon_available: "bg-green-600 text-white border border-green-400",
    preorder: "bg-white text-black border border-white",
    preorder_long: "bg-white text-black border border-white",
  };

  const statusLabels = {
    available: "В наличии",
    soon_available: "Скоро в наличии",
    preorder: "Подзаказ",
    preorder_long: "Предзаказ",
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col border border-white/10 bg-black street-card"
    >
      <div className="relative aspect-square overflow-hidden bg-black border-b border-white/10">
        {images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/50">
            Нет фото
          </div>
        )}
        {product.is_new && (
          <span className="absolute left-2 top-2 bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            NEW
          </span>
        )}
        {product.status && (
          <span className={`absolute right-2 top-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusColors[product.status as keyof typeof statusColors]}`}>
            {statusLabels[product.status as keyof typeof statusLabels]}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <h3 className="line-clamp-2 text-xs font-bold uppercase tracking-tight text-white">
          {product.title}
        </h3>
        {product.brand && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            {product.brand}
          </p>
        )}
        <p className="text-sm font-bold text-white">{product.price} ₴</p>
        
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <span
                key={size}
                className="w-6 h-6 flex items-center justify-center text-[10px] font-bold border border-white/20 bg-white text-black"
              >
                {size}
              </span>
            ))}
          </div>
        )}
        
        <button className="mt-2 w-full bg-white py-3 text-[10px] font-bold uppercase tracking-wider text-black street-btn">
          Подробнее
        </button>
      </div>
    </Link>
  );
}
