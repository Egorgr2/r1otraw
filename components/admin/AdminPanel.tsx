"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PinGate } from "@/components/admin/PinGate";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import { ReviewUpload } from "@/components/admin/ReviewUpload";
import { clearAdminAuthenticated, isAdminAuthenticated } from "@/lib/admin";
import { supabase, type Product } from "@/lib/supabase";

type AdminPanelProps = {
  expectedPin: string;
};

export function AdminPanel({ expectedPin }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
    setChecked(true);
  }, []);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed, fetchProducts]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      if (editingProduct?.id === id) setEditingProduct(null);
      fetchProducts();
    }
  };

  if (!checked) return null;

  if (!authed) {
    return <PinGate expectedPin={expectedPin} onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-sm uppercase tracking-street">Admin</h1>
        <div className="flex gap-4">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-wider text-muted underline"
          >
            ← Магазин
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminAuthenticated();
              setAuthed(false);
            }}
            className="text-[10px] uppercase tracking-wider text-muted underline"
          >
            Вийти
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-lg flex-col gap-10">
        <section className="border border-surface-border p-4">
          <ProductForm
            key={editingProduct?.id ?? "new"}
            editingProduct={editingProduct}
            onSaved={() => {
              setEditingProduct(null);
              fetchProducts();
            }}
            onCancelEdit={() => setEditingProduct(null)}
          />
        </section>

        <section className="border border-surface-border p-4">
          <h2 className="mb-4 text-xs uppercase tracking-street">
            Всі товари
          </h2>
          <ProductTable
            products={products}
            loading={loading}
            onEdit={(p) => {
              setEditingProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDelete}
          />
        </section>

        <section className="border border-surface-border p-4">
          <ReviewUpload />
        </section>
      </div>
    </div>
  );
}
