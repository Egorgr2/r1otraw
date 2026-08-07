"use client";

import { getProductImages, type Product } from "@/lib/supabase";

type ProductTableProps = {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-muted">
        Завантаження...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted">
        Товарів поки немає
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-border text-[10px] uppercase tracking-wider text-muted">
            <th className="pb-3 pr-4 font-medium">Фото</th>
            <th className="pb-3 pr-4 font-medium">Назва</th>
            <th className="pb-3 pr-4 font-medium">Ціна</th>
            <th className="pb-3 font-medium">Дії</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const thumb = getProductImages(product)[0];
            return (
              <tr
                key={product.id}
                className="border-b border-surface-border/50"
              >
                <td className="py-3 pr-4">
                  <div className="h-12 w-12 overflow-hidden bg-surface-raised">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[9px] text-muted">
                        —
                      </div>
                    )}
                  </div>
                </td>
                <td className="max-w-[140px] truncate py-3 pr-4 text-xs">
                  {product.title}
                </td>
                <td className="py-3 pr-4 text-xs">{product.price} ₴</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="border border-surface-border px-2 py-1 text-[10px] uppercase tracking-wider hover:border-white"
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Видалити товар?")) onDelete(product.id);
                      }}
                      className="border border-red-900 px-2 py-1 text-[10px] uppercase tracking-wider text-red-400 hover:border-red-400"
                    >
                      Видалити
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
