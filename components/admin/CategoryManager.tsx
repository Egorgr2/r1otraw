"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { sanitizeString } from "@/lib/validation";
import { useNotification, Notification } from "@/components/Notification";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  order: number;
  created_at: string;
};

export function CategoryManager() {
  const { notification, showNotification, hideNotification } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_id: null as string | null,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        console.error("Supabase client not available");
        setCategories([]);
        return;
      }
      
      // Сначала получаем уникальные категории из товаров
      const { data: products, error } = await supabase
        .from("products")
        .select("category");

      if (error) {
        console.error("Error fetching products:", error);
        setCategories([]);
        return;
      }

      if (products) {
        const uniqueCategories = Array.from(
          new Set(products.map((p: { category: string | null }) => p.category).filter((c: string | null): c is string => c !== null))
        ) as string[];
        
        const categoryObjects = uniqueCategories.map((name, index) => ({
          id: `cat_${index}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          parent_id: null,
          order: index,
          created_at: new Date().toISOString(),
        }));

        setCategories(categoryObjects);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showNotification("error", "Введите название категории");
      return;
    }

    if (!supabase) {
      showNotification("error", "Ошибка подключения к базе данных");
      return;
    }

    try {
      if (editingCategory) {
        // Обновляем категорию (обновляем товары с этой категорией)
        const { error } = await supabase
          .from("products")
          .update({ category: formData.name })
          .eq("category", editingCategory.name);

        if (error) throw error;
      } else {
        // Добавляем новую категорию (это просто список из товаров)
        // Ничего не делаем, так как категории берутся из товаров
        showNotification("info", "Категории создаются автоматически на основе товаров");
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "", parent_id: null });
      await loadCategories();
      showNotification("success", "Категория успешно обновлена");
    } catch (error) {
      console.error("Error saving category:", error);
      showNotification("error", "Ошибка сохранения категории");
    }
  };

  const deleteCategory = async (categoryName: string) => {
    if (!confirm(`Удалить категорию "${categoryName}"? Все товары с этой категорией будут помечены как без категории.`)) {
      return;
    }

    if (!supabase) {
      showNotification("error", "Ошибка подключения к базе данных");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({ category: null })
        .eq("category", categoryName);

      if (error) throw error;

      await loadCategories();
      showNotification("success", "Категория успешно удалена");
    } catch (error) {
      console.error("Error deleting category:", error);
      showNotification("error", "Ошибка удаления категории");
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id,
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Управление категориями
        </h2>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-surface-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-street">
          Управление категориями ({categories.length})
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", slug: "", parent_id: null });
            setShowForm(!showForm);
          }}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          {showForm ? "Отмена" : "+ Категория"}
        </button>
      </div>

      {/* Форма создания/редактирования */}
      {showForm && (
        <div className="border border-surface-border bg-black/50 p-4 rounded mb-4 transition-all duration-200">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-1">
                Название категории
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: sanitizeString(e.target.value) })}
                className="w-full text-[10px] bg-black border border-surface-border text-white px-2 py-2 rounded focus:border-white focus:outline-none transition-colors"
                placeholder="Например: Худи"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-gray-200 transition-colors rounded"
            >
              {editingCategory ? "Обновить" : "Создать"}
            </button>
          </form>
        </div>
      )}

      {/* Список категорий */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">
            Нет категорий
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="border border-surface-border bg-black/50 p-3 rounded flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white">{category.name}</p>
                <p className="text-[10px] text-muted">Slug: {category.slug}</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => editCategory(category)}
                  className="text-[10px] font-bold text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500/30 transition-colors"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(category.name)}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30 transition-colors"
                >
                  ✗
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[10px] text-muted">
        ℹ️ Категории создаются автоматически на основе товаров. 
        Изменение категории обновит все товары с этой категорией.
      </div>
      
      <Notification notification={notification} onClose={hideNotification} />
    </div>
  );
}