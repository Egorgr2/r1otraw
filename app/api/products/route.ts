import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inStock = searchParams.get("in_stock");

  let query = supabase.from("products").select("*").order("created_at", {
    ascending: false,
  });

  if (inStock !== null) {
    query = query.eq("is_available", inStock === "true");
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
