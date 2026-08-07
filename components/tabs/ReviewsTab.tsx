"use client";

import { useEffect, useState } from "react";
import { ReviewGridSkeleton } from "@/components/ui/Skeleton";
import { supabase, type Review } from "@/lib/supabase";

export function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState<string | null>(null);

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

  if (loading) return <ReviewGridSkeleton />;

  if (reviews.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6">
        <p className="text-xs uppercase tracking-wider text-muted">
          Пока нет отзывов
        </p>
      </div>
    );
  }

  return (
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
  );
}
