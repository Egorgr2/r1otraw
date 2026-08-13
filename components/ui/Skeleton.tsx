import React from "react";

type SkeletonProps = {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  count?: number;
};

export function Skeleton({
  className = "",
  variant = "rectangular",
  width = "100%",
  height = "1rem",
  count = 1,
}: SkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`animate-pulse rounded ${
        variant === "circular" ? "rounded-full" : "rounded"
      } ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
    />
  ));

  return <>{skeletons}</>;
}

// Skeleton для карточки товара
export function ProductCardSkeleton() {
  return (
    <div className="border border-surface-border bg-black/50 p-3 rounded">
      <div className="aspect-square mb-3 rounded bg-surface-raised animate-pulse" />
      <Skeleton variant="text" width="80%" height="1rem" className="mb-2" />
      <Skeleton variant="text" width="60%" height="0.875rem" className="mb-2" />
      <Skeleton variant="text" width="40%" height="1rem" />
    </div>
  );
}

// Skeleton для строки таблицы
export function TableRowSkeleton() {
  return (
    <div className="border border-surface-border bg-black/50 p-3 rounded flex items-center gap-3">
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="text" width="30%" height="1rem" />
      <Skeleton variant="text" width="20%" height="0.875rem" />
      <Skeleton variant="text" width="15%" height="0.875rem" />
      <Skeleton variant="text" width="10%" height="1rem" />
    </div>
  );
}

// Skeleton для карточки статистики
export function StatCardSkeleton() {
  return (
    <div className="border border-surface-border bg-black/50 p-3 rounded">
      <Skeleton variant="text" width="60%" height="0.75rem" className="mb-2" />
      <Skeleton variant="text" width="40%" height="2rem" />
    </div>
  );
}

// Skeleton для сетки товаров
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton для карточки товара
export function ProductPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-lg bg-surface-raised animate-pulse" />
      <Skeleton variant="text" width="80%" height="1.5rem" />
      <Skeleton variant="text" width="60%" height="1rem" />
      <Skeleton variant="text" width="40%" height="1rem" />
      <div className="h-20 animate-pulse bg-surface-raised rounded" />
    </div>
  );
}

// Skeleton для сетки отзывов
export function ReviewGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-lg bg-surface-raised animate-pulse" />
      ))}
    </div>
  );
}