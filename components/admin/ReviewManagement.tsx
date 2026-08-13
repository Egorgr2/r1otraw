"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
};

export function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("date", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  const approveReview = async (reviewId: string) => {
    const { error } = await supabase
      .from("reviews")
      .update({ approved: true })
      .eq("id", reviewId);

    if (!error) {
      await loadReviews();
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Удалить этот отзыв?")) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (!error) {
      await loadReviews();
    }
  };

  const filteredReviews = filter === "all" 
    ? reviews 
    : filter === "pending" 
    ? reviews.filter(r => !r.approved)
    : reviews.filter(r => r.approved);

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="border border-surface-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-street">
          Управление отзывами ({reviews.length})
        </h2>
        <button
          type="button"
          onClick={loadReviews}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          Обновить
        </button>
      </div>

      {/* Фильтр */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`text-[10px] px-2 py-1 rounded border ${
            filter === "all"
              ? "border-white bg-white text-black"
              : "border-surface-border text-muted"
          }`}
        >
          Все
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`text-[10px] px-2 py-1 rounded border ${
            filter === "pending"
              ? "border-white bg-white text-black"
              : "border-surface-border text-muted"
          }`}
        >
          Ожидают
        </button>
        <button
          type="button"
          onClick={() => setFilter("approved")}
          className={`text-[10px] px-2 py-1 rounded border ${
            filter === "approved"
              ? "border-white bg-white text-black"
              : "border-surface-border text-muted"
          }`}
        >
          Одобренные
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted">
          Нет отзывов
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`border p-3 rounded ${
                review.approved
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-yellow-500/30 bg-yellow-500/10"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-white mb-1">
                    {review.customer_name}
                  </p>
                  <p className="text-[10px] text-muted mb-1">
                    {renderStars(review.rating)}
                  </p>
                  <p className="text-[10px] text-muted">
                    {new Date(review.date).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!review.approved && (
                    <button
                      type="button"
                      onClick={() => approveReview(review.id)}
                      className="text-[10px] font-bold text-green-400 hover:text-green-300 px-2 py-1 rounded border border-green-500/30"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteReview(review.id)}
                    className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30"
                  >
                    ✗
                  </button>
                </div>
              </div>

              <p className="text-xs text-white">{review.text}</p>

              {review.approved && (
                <div className="mt-2 text-[10px] text-green-400">
                  ✓ Одобрен
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}