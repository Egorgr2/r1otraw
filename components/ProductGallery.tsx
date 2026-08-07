"use client";

import { useRef, useState } from "react";
import { getProductImages } from "@/lib/supabase";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const width = container.offsetWidth;
    container.scrollTo({ left: width * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    setActiveIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-surface-raised text-xs text-muted">
        Нет фото
      </div>
    );
  }

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex aspect-[3/4] snap-x snap-mandatory overflow-x-auto scrollbar-hide"
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt={`${title} — фото ${i + 1}`}
            className="h-full w-full shrink-0 snap-center object-cover"
            draggable={false}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => scrollTo(i)}
              className={`h-14 w-14 shrink-0 overflow-hidden border transition-colors ${
                activeIndex === i ? "border-white" : "border-surface-border opacity-60"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
