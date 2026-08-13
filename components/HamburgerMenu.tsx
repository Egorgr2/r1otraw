"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";
import Link from "next/link";

type MenuItem = {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "catalog",
    label: "Каталог",
    children: [
      { id: "all", label: "Вся одежда", path: "/catalog" },
      {
        id: "upper-clothes",
        label: "Верхняя одежда",
        children: [
          { id: "all-upper", label: "Вся верхняя одежда", path: "/catalog?category=Вся верхняя одежда" },
          { id: "tshirt", label: "Футболка", path: "/catalog?category=Футболка" },
          { id: "longsleeve", label: "Лонгслив", path: "/catalog?category=Лонгслив" },
          { id: "hoodie", label: "Худи", path: "/catalog?category=Худи" },
          { id: "ziphoodie", label: "Зипхуди", path: "/catalog?category=Зипхуди" },
          { id: "sweater", label: "Свитер", path: "/catalog?category=Свитер" },
          { id: "cardigan", label: "Кардиган", path: "/catalog?category=Кардиган" },
          { id: "shirt", label: "Рубашка", path: "/catalog?category=Рубашка" },
          { id: "jacket", label: "Пиджак", path: "/catalog?category=Пиджак" },
          { id: "vest", label: "Жилет", path: "/catalog?category=Жилет" },
          { id: "waistcoat", label: "Жилетка", path: "/catalog?category=Жилетка" },
          { id: "bomber", label: "Бомбер", path: "/catalog?category=Бомбер" },
          { id: "jacket-coat", label: "Куртка", path: "/catalog?category=Куртка" },
          { id: "tank", label: "Майка", path: "/catalog?category=Майка" },
        ],
      },
      {
        id: "lower-clothes",
        label: "Нижняя одежда",
        children: [
          { id: "all-lower", label: "Вся нижняя одежда", path: "/catalog?category=Вся нижняя одежда" },
          { id: "trousers", label: "Брюки", path: "/catalog?category=Брюки" },
          { id: "pants", label: "Штаны", path: "/catalog?category=Штаны" },
          { id: "jeans", label: "Джинсы", path: "/catalog?category=Джинсы" },
          { id: "shorts", label: "Шорты", path: "/catalog?category=Шорты" },
        ],
      },
      {
        id: "footwear",
        label: "Обувь",
        children: [
          { id: "all-footwear", label: "Вся обувь", path: "/catalog?category=Вся обувь" },
          { id: "sneakers", label: "Кроссовки", path: "/catalog?category=Кроссовки" },
          { id: "sneakers-low", label: "Кеды", path: "/catalog?category=Кеды" },
          { id: "boots", label: "Ботинки", path: "/catalog?category=Ботинки" },
        ],
      },
      {
        id: "accessories",
        label: "Аксессуары",
        children: [
          { id: "all-accessories", label: "Все аксессуары", path: "/catalog?category=Все аксессуары" },
          { id: "bag", label: "Сумка", path: "/catalog?category=Сумка" },
          { id: "belt", label: "Ремень", path: "/catalog?category=Ремень" },
          { id: "cap", label: "Кепка", path: "/catalog?category=Кепка" },
          { id: "hat", label: "Шапка", path: "/catalog?category=Шапка" },
          { id: "glasses", label: "Очки", path: "/catalog?category=Очки" },
          { id: "watch", label: "Часы", path: "/catalog?category=Часы" },
          { id: "pendant", label: "Подвеска", path: "/catalog?category=Подвеска" },
          { id: "bracelet", label: "Браслет", path: "/catalog?category=Браслет" },
          { id: "gloves", label: "Перчатки", path: "/catalog?category=Перчатки" },
          { id: "scarf", label: "Шарф", path: "/catalog?category=Шарф" },
        ],
      },
    ],
  },
];

type MenuProps = {
  onClose: () => void;
};

export function HamburgerMenu({ onClose }: MenuProps) {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["catalog"])); // Каталог всегда раскрыт

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} className="w-full">
        <button
          type="button"
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else if (item.path) {
              onClose();
              router.push(item.path);
            }
          }}
          className={`w-full flex items-center justify-between py-3 px-4 text-left transition-colors ${
            level === 0 ? "text-base font-bold" : "text-sm"
          } hover:bg-white/10`}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <span className="ml-2 text-sm transition-transform">
              {isExpanded ? "▼" : "▶"}
            </span>
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="pl-4">
            {item.children?.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black fade-in">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <h2 className="text-sm font-bold uppercase tracking-tight brand-text">Меню</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-2xl text-white hover:text-white/70 transition-colors"
        >
          ×
        </button>
      </div>
      
      <div className="py-4">
        {MENU_ITEMS.map((item) => renderItem(item))}
      </div>
    </div>
  );
}