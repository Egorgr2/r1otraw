import { supabase } from "./supabase";
import { STORAGE_BUCKET } from "./admin";

function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  // Используем простой путь без вложенных папок
  const path = `product-${timestamp}-${random}.${ext}`;

  console.log("Загрузка файла:", { path, bucket: STORAGE_BUCKET });

  const { error, data } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Ошибка загрузки:", error);
    throw new Error(`Ошибка загрузки в Storage: ${error.message}`);
  }

  console.log("Файл загружен успешно:", data);
  return getPublicUrl(path);
}

export async function uploadReviewImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  // Используем простой путь без вложенных папок
  const path = `review-${timestamp}-${random}.${ext}`;

  console.log("Загрузка отзыва:", { path, bucket: STORAGE_BUCKET });

  const { error, data } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Ошибка загрузки отзыва:", error);
    throw new Error(`Ошибка загрузки в Storage: ${error.message}`);
  }

  console.log("Отзыв загружен успешно:", data);
  return getPublicUrl(path);
}
