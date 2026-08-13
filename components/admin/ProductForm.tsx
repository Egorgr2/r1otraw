"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  SIZES,
  STORAGE_BUCKET,
  DISABLE_STORAGE_UPLOAD,
} from "@/lib/admin";
import { uploadProductImage } from "@/lib/storage";
import { supabase, type Product } from "@/lib/supabase";
import { isValidPrice, isValidProductName, isValidBrandName, isValidImageUrl, sanitizeString } from "@/lib/validation";

export type ProductFormData = {
  title: string;
  brand: string;
  category: string;
  price: string;
  sizes: string[];
  is_available: boolean;
  status: string;
  images: string[];
};

const emptyForm: ProductFormData = {
  title: "",
  brand: "",
  category: CATEGORIES[0],
  price: "",
  sizes: [],
  is_available: true,
  status: "available",
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
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState("");
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        title: editingProduct.title,
        brand: editingProduct.brand ?? "",
        category: editingProduct.category ?? CATEGORIES[0],
        price: String(editingProduct.price),
        sizes: editingProduct.sizes ?? [],
        is_available: editingProduct.is_available,
        status: editingProduct.status ?? "available",
        images: editingProduct.images ?? [],
      });
      setBrandInput(editingProduct.brand ?? "");
    } else {
      setForm(emptyForm);
      setBrandInput("");
    }
  }, [editingProduct]);

  useEffect(() => {
    // Загружаем уникальные бренды из товаров
    supabase
      .from("products")
      .select("brand")
      .not("brand", "is", null)
      .then(({ data }: { data: { brand: string }[] | null }) => {
        const brands = data?.map(p => p.brand).filter(Boolean) || [];
        const uniqueBrands = Array.from(new Set(brands));
        setAvailableBrands(uniqueBrands.sort());
      });
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) return;

      // Если загрузка в Storage отключена, показываем сообщение
      if (DISABLE_STORAGE_UPLOAD) {
        setError("Загрузка файлов временно отключена. Используйте поле 'Или добавьте URL изображения' ниже.");
        return;
      }

      setUploading(true);
      setError(null);
      try {
        // Пробуем загрузить без проверки bucket
        const urls = await Promise.all(
          list.map((file) =>
            uploadProductImage(file, editingProduct?.id)
          )
        );
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError(err instanceof Error ? err.message : "Ошибка загрузки. Попробуйте использовать URL-адреса изображений.");
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
    setError(null);
    
    // Валидация полей
    if (!isValidProductName(form.title)) {
      setError("Название товара должно быть от 2 до 200 символов");
      return;
    }
    
    if (!isValidPrice(form.price)) {
      setError("Неверная цена. Введите число от 0 до 1000000");
      return;
    }
    
    if (form.brand && !isValidBrandName(form.brand)) {
      setError("Название бренда должно быть от 1 до 100 символов");
      return;
    }
    
    // Валидация URL изображений
    const invalidImage = form.images.find(url => !isValidImageUrl(url));
    if (invalidImage) {
      setError("Неверный формат URL изображения");
      return;
    }

    setSaving(true);

    const payload = {
      title: sanitizeString(form.title),
      brand: form.brand ? sanitizeString(form.brand) : null,
      category: form.category,
      price: Number(form.price),
      sizes: form.sizes,
      is_available: form.status === "available",
      status: form.status,
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
        <div className="relative">
          <input
            value={brandInput}
            onChange={(e) => {
              setBrandInput(e.target.value);
              setForm({ ...form, brand: e.target.value });
              setShowBrandSuggestions(true);
            }}
            onFocus={() => setShowBrandSuggestions(true)}
            onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
            className={inputClass}
            placeholder="Начните вводить бренд..."
          />
          {showBrandSuggestions && brandInput && (
            <div className="absolute z-10 w-full mt-1 bg-black border border-surface-border rounded max-h-48 overflow-y-auto">
              {availableBrands
                .filter(brand => brand.toLowerCase().includes(brandInput.toLowerCase()))
                .map(brand => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setBrandInput(brand);
                      setForm({ ...form, brand });
                      setShowBrandSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-white hover:bg-surface-raised"
                  >
                    {brand}
                  </button>
                ))}
              {!availableBrands.some(brand => brand.toLowerCase().includes(brandInput.toLowerCase())) && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, brand: brandInput.trim() });
                    setShowBrandSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-muted hover:bg-surface-raised"
                >
                  + Добавить новый бренд: {brandInput.trim()}
                </button>
              )}
            </div>
          )}
        </div>
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

      <Field label="Статус">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, status: "available" })}
            className={`border py-2.5 text-[10px] uppercase tracking-wider ${
              form.status === "available"
                ? "border-white bg-white text-black"
                : "border-surface-border text-muted"
            }`}
          >
            В наличии
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, status: "soon_available" })}
            className={`border py-2.5 text-[10px] uppercase tracking-wider ${
              form.status === "soon_available"
                ? "border-white bg-white text-black"
                : "border-surface-border text-muted"
            }`}
          >
            Скоро в наличии
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, status: "preorder" })}
            className={`border py-2.5 text-[10px] uppercase tracking-wider ${
              form.status === "preorder"
                ? "border-white bg-white text-black"
                : "border-surface-border text-muted"
            }`}
          >
            Подзаказ
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, status: "preorder_long" })}
            className={`border py-2.5 text-[10px] uppercase tracking-wider ${
              form.status === "preorder_long"
                ? "border-white bg-white text-black"
                : "border-surface-border text-muted"
            }`}
          >
            Предзаказ
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
        
        <div className="mt-2">
          <label className="block mb-1 text-xs text-muted">Или добавьте URL изображения:</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="flex-1 border border-surface-border bg-black px-3 py-2 text-xs text-white placeholder:text-muted focus:border-white focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    setForm((prev) => ({ ...prev, images: [...prev.images, input.value.trim()] }));
                    input.value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                const urlValue = input.value.trim();
                if (urlValue && isValidImageUrl(urlValue)) {
                  setForm((prev) => ({ ...prev, images: [...prev.images, urlValue] }));
                  input.value = '';
                } else if (urlValue) {
                  setError("Неверный формат URL изображения");
                }
              }}
              className="border border-surface-border px-3 py-2 text-xs uppercase tracking-wider hover:border-white"
            >
              Добавить
            </button>
          </div>
        </div>
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
        {saving ? "Сохранение..." : "Сохранить"}
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
