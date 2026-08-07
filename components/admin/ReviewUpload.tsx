"use client";

import { useCallback, useState } from "react";
import { uploadReviewImage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

export function ReviewUpload() {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type.startsWith("image/"));
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const imageUrl = await uploadReviewImage(file);
      const { error } = await supabase
        .from("reviews")
        .insert({ image_url: imageUrl });

      if (error) throw new Error(error.message);
      setMessage("Відгук збережено");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Помилка завантаження");
    } finally {
      setUploading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs uppercase tracking-street">Відгуки</h2>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center border border-dashed py-10 text-xs transition-colors ${
          dragOver
            ? "border-white text-white"
            : "border-surface-border text-muted"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="review-upload"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
        <label htmlFor="review-upload" className="cursor-pointer text-center">
          <span className="block">
            {uploading
              ? "Завантаження..."
              : "Перетягніть скриншот відгуку сюди"}
          </span>
          {!uploading && (
            <span className="mt-1 block text-muted">
              або натисніть для вибору
            </span>
          )}
        </label>
      </div>
      {message && (
        <p
          className={`text-xs ${
            message.includes("збережено") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
