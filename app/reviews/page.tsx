"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ReviewGridSkeleton } from "@/components/ui/Skeleton";
import { supabase, type Review } from "@/lib/supabase";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState<string | null>(null);
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "R1OTRAW";

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }: { data: Review[] | null; error: any }) => {
        if (!error) setReviews(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pb-6">
      <Header shopName={shopName} />
      <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => window.location.href = "/"}
          className="text-white hover:text-muted mr-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-street">Отзывы</h1>
      </div>

      {loading ? (
        <ReviewGridSkeleton />
      ) : reviews.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center px-6">
          <p className="text-xs uppercase tracking-wider text-muted">
            Пока нет отзывов
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-6">
            {reviews.map((review) => (
              <button
                key={review.id}
                type="button"
                onClick={() => setFullscreen(review.image_url)}
                className="group flex flex-col active:opacity-80"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-raised border border-surface-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={review.image_url}
                    alt="Отзыв"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105 group-active:scale-[0.98]"
                  />
                </div>
                <div className="mt-3">
                  <button className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-gray-200 active:bg-gray-300 rounded">
                    Открыть
                  </button>
                </div>
              </button>
            ))}
          </div>

          {fullscreen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              onClick={() => setFullscreen(null)}
              role="dialog"
              aria-modal
            >
              <button
                type="button"
                onClick={() => setFullscreen(null)}
                className="absolute right-4 top-4 z-10 text-xs uppercase tracking-wider text-muted"
              >
                Закрыть
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fullscreen}
                alt="Отзыв"
                className="max-h-full max-w-full object-contain p-4"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}