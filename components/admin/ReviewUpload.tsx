"use client";

import { useCallback, useState } from "react";
import { uploadReviewImage } from "@/lib/storage";
import { STORAGE_BUCKET } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export function ReviewUpload() {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type.startsWith("image/"));
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      // Проверяем, существует ли bucket в Supabase Storage
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Ошибка при получении списка buckets:", bucketError);
        setMessage(`Ошибка доступа к Storage: ${bucketError.message}. Проверьте настройки Supabase.`);
        return;
      }
      
      const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);
      
      if (!bucketExists) {
        const availableBuckets = buckets?.map(b => b.name).join(", ") || "нет";
        setMessage(`Bucket '${STORAGE_BUCKET}' не найден. Доступные: ${availableBuckets}. Создайте bucket 'product-images' или используйте URL-адреса.`);
        return;
      }

      const imageUrl = await uploadReviewImage(file);
      const { error } = await supabase
        .from("reviews")
        .insert({ image_url: imageUrl });

      if (error) throw new Error(error.message);
      setMessage("Отзыв сохранен");
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setMessage(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) return;

    setUploading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("reviews")
        .insert({ image_url: urlInput.trim() });

      if (error) throw new Error(error.message);
      setMessage("Отзыв сохранен");
      setUrlInput("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }, [urlInput]);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs uppercase tracking-street">Отзывы</h2>
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
              ? "Загрузка..."
              : "Перетащите скриншот отзыва сюда"}
          </span>
          {!uploading && (
            <span className="mt-1 block text-muted">
              или нажмите для выбора
            </span>
          )}
        </label>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted">Или добавьте URL изображения:</label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={uploading}
            className="border border-surface-border px-3 py-2 text-xs uppercase tracking-wider hover:border-white disabled:opacity-50"
          >
            Добавить
          </button>
        </div>
      </div>
      
      {message && (
        <p
          className={`text-xs ${
            message.includes("сохранен") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
