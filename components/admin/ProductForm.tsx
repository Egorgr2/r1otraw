"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  SIZES,
} from "@/lib/admin";
import { uploadProductImage } from "@/lib/storage";
import { supabase, type Product } from "@/lib/supabase";

export type ProductFormData = {
  title: string;
  brand: string;
  category: string;
  price: string;
  sizes: string[];
  is_available: boolean;
  images: string[];
};

const emptyForm: ProductFormData = {
  title: "",
  brand: "",
  category: CATEGORIES[0],
  price: "",
  sizes: [],
  is_available: true,
  images: [],
};

type ProductFormProps = {
  editingProduct: Product | null;
  onSaved: () => void;
  onCancelEdit: () => void;
};

export function ProductForm({
  editingProduct,
  onSaved,
  onCancelEdit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        title: editingProduct.title,
        brand: editingProduct.brand ?? "",
        category: editingProduct.category ?? CATEGORIES[0],
        price: String(editingProduct.price),
        sizes: editingProduct.sizes ?? [],
        is_available: editingProduct.is_available,
        images: editingProduct.images ?? [],
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) return;

      setUploading(true);
      setError(null);
      try {
        const urls = await Promise.all(
          list.map((file) =>
            uploadProductImage(file, editingProduct?.id)
          )
        );
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setUploading(false);
      }
    },
    [editingProduct?.id]
  );

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) {
      setError("Заполните название и цену");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      brand: form.brand.trim() || null,
      category: form.category,
      price: Number(form.price),
      sizes: form.sizes,
      is_available: form.is_available,
      images: form.images,
      image_url: form.images[0] ?? null,
    };

    const { error: dbError } = editingProduct
      ? await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setForm(emptyForm);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xs uppercase tracking-street">
        {editingProduct ? "Редактировать товар" : "Новый товар"}
      </h2>

      {editingProduct && (
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            onCancelEdit();
          }}
          className="self-start text-[10px] uppercase tracking-wider text-muted underline"
        >
          Отменить редактирование
        </button>
      )}

      <Field label="Название">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          required
        />
      </Field>

      <Field label="Бренд">
        <input
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field label="Категория">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={inputClass}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-black">
              {cat}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Цена (₴)">
        <input
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className={inputClass}
          required
        />
      </Field>

      <Field label="Размеры">
        <div className="flex gap-2">
          {SIZES.map((size) => (
            <label
              key={size}
              className={`flex cursor-pointer items-center gap-1.5 border px-3 py-2 text-xs uppercase tracking-wider ${
                form.sizes.includes(size)
                  ? "border-white bg-white text-black"
                  : "border-surface-border"
              }`}
            >
              <input
                type="checkbox"
                checked={form.sizes.includes(size)}
                onChange={() => toggleSize(size)}
                className="sr-only"
              />
              {size}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Наличие">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, is_available: true })}
            className={`flex-1 border py-2.5 text-[10px] uppercase tracking-wider ${
              form.is_available
                ? "border-white bg-white text-black"
                : "border-surface-border text-muted"
            }`}
          >
            В наличии
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_available: false })}
            className={`flex-1 border py-2.5 text-[10px] uppercase tracking-wider ${
              !form.is_available
                ? "border-white bg-white text-black"
                : "border-surface-border text-muted"
            }`}
          >
            Под заказ
          </button>
        </div>
      </Field>

      <Field label="Фото">
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-surface-border py-8 text-xs text-muted transition-colors hover:border-white"
        >
          {uploading ? "Загрузка..." : "Нажмите или перетащите фото"}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {form.images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.images.map((url) => (
              <div key={url} className="relative h-16 w-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-white text-[10px] text-black"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full bg-white py-3.5 text-[10px] font-medium uppercase tracking-street text-black disabled:opacity-40"
      >
        {saving ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "border border-surface-border bg-surface-raised px-3 py-2.5 text-sm outline-none focus:border-white";
