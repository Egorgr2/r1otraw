type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-surface-raised ${className}`}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReviewGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-none" />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="flex gap-2 px-4 py-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-14 shrink-0 rounded-none" />
        ))}
      </div>
      <div className="flex flex-col gap-3 px-4 py-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="mt-2 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-12 rounded-none" />
          ))}
        </div>
        <Skeleton className="mt-4 h-14 w-full rounded-none" />
      </div>
    </div>
  );
}

export function SellerSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-10">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-full max-w-xs" />
      <Skeleton className="h-3 w-full max-w-xs" />
      <Skeleton className="mt-4 h-12 w-full max-w-xs rounded-none" />
    </div>
  );
}
