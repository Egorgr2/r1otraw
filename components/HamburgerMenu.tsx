"use client";

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
          { id: "all-upper", label: "Вся верхняя одежда", path: "/catalog?category=upper" },
          { id: "tshirt", label: "Футболка", path: "/catalog?category=tshirt" },
          { id: "longsleeve", label: "Лонгслив", path: "/catalog?category=longsleeve" },
          { id: "hoodie", label: "Худи", path: "/catalog?category=hoodie" },
          { id: "ziphoodie", label: "Зипхуди", path: "/catalog?category=ziphoodie" },
          { id: "sweater", label: "Свитер", path: "/catalog?category=sweater" },
          { id: "cardigan", label: "Кардиган", path: "/catalog?category=cardigan" },
          { id: "shirt", label: "Рубашка", path: "/catalog?category=shirt" },
          { id: "jacket", label: "Пиджак", path: "/catalog?category=jacket" },
          { id: "vest", label: "Жилет", path: "/catalog?category=vest" },
          { id: "waistcoat", label: "Жилетка", path: "/catalog?category=waistcoat" },
          { id: "bomber", label: "Бомбер", path: "/catalog?category=bomber" },
          { id: "jacket-coat", label: "Куртка", path: "/catalog?category=jacket-coat" },
          { id: "tank", label: "Майка", path: "/catalog?category=tank" },
        ],
      },
      {
        id: "lower-clothes",
        label: "Нижняя одежда",
        children: [
          { id: "all-lower", label: "Вся нижняя одежда", path: "/catalog?category=lower" },
          { id: "trousers", label: "Брюки", path: "/catalog?category=trousers" },
          { id: "pants", label: "Штаны", path: "/catalog?category=pants" },
          { id: "jeans", label: "Джинсы", path: "/catalog?category=jeans" },
          { id: "shorts", label: "Шорты", path: "/catalog?category=shorts" },
        ],
      },
      {
        id: "footwear",
        label: "Обувь",
        children: [
          { id: "all-footwear", label: "Вся обувь", path: "/catalog?category=footwear" },
          { id: "sneakers", label: "Кроссовки", path: "/catalog?category=sneakers" },
          { id: "sneakers-low", label: "Кеды", path: "/catalog?category=sneakers-low" },
          { id: "boots", label: "Ботинки", path: "/catalog?category=boots" },
        ],
      },
      {
        id: "accessories",
        label: "Аксессуары",
        children: [
          { id: "all-accessories", label: "Все аксессуары", path: "/catalog?category=accessories" },
          { id: "bag", label: "Сумка", path: "/catalog?category=bag" },
          { id: "belt", label: "Ремень", path: "/catalog?category=belt" },
          { id: "cap", label: "Кепка", path: "/catalog?category=cap" },
          { id: "hat", label: "Шапка", path: "/catalog?category=hat" },
          { id: "glasses", label: "Очки", path: "/catalog?category=glasses" },
          { id: "watch", label: "Часы", path: "/catalog?category=watch" },
          { id: "pendant", label: "Подвеска", path: "/catalog?category=pendant" },
          { id: "bracelet", label: "Браслет", path: "/catalog?category=bracelet" },
          { id: "gloves", label: "Перчатки", path: "/catalog?category=gloves" },
          { id: "scarf", label: "Шарф", path: "/catalog?category=scarf" },
        ],
      },
    ],
  },
  { id: "reviews", label: "Отзывы", path: "/reviews" },
];

type MenuProps = {
  onClose: () => void;
};

export function HamburgerMenu({ onClose }: MenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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
              window.location.href = item.path;
            }
          }}
          className={`w-full flex items-center justify-between py-3 px-4 text-left transition-colors ${
            level === 0 ? "text-base font-medium" : "text-sm"
          } hover:bg-surface-raised`}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <span className="ml-2 text-xs transition-transform">
              {isExpanded ? "▾" : "▸"}
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
    <div className="fixed inset-0 z-50 bg-black">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-4">
        <h2 className="text-sm font-bold uppercase tracking-street">Меню</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-2xl text-white hover:text-muted"
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