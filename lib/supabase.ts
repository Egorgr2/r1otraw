import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Helper function to check if supabase is available
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

export type Product = {
  id: string;
  title: string;
  price: number;
  brand: string | null;
  category: string | null;
  images: string[] | null;
  image_url: string | null;
  sizes: string[] | null;
  is_available: boolean;
  is_new: boolean;
  status: string;
  created_at: string;
};

export type Review = {
  id: string;
  image_url: string;
  created_at: string;
};

export type HomePage = {
  id: string;
  title: string;
  featured_product_ids: string[];
  created_at: string;
  updated_at: string;
};

export function getProductImages(product: Product): string[] {
  if (product.images?.length) return product.images;
  if (product.image_url) return [product.image_url];
  return [];
}

export function formatSizes(sizes: string[] | null): string {
  if (!sizes?.length) return "";
  return sizes.join(" · ");
}
