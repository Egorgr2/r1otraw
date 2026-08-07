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
  const folder = productId ?? "drafts";
  const path = `products/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);
  return getPublicUrl(path);
}

export async function uploadReviewImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `reviews/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);
  return getPublicUrl(path);
}
