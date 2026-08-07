"use client";

import { useState } from "react";

type SortingProps = {
  onSortChange: (sortBy: string) => void;
};

export function Sorting({ onSortChange }: SortingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("newest");

  const SORT_OPTIONS = [
    { id: "newest", label: "Новинки" },
    { id: "price-asc", label: "Цена: по возрастанию" },
    { id: "price-desc", label: "Цена: по убыванию" },
  ];

  const handleSort = (sortId: string) => {
    setCurrentSort(sortId);
    onSortChange(sortId);
    setIsOpen(false);
  };

  const currentLabel = SORT_OPTIONS.find(opt => opt.id === currentSort)?.label || "Сортировка";

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 text-[10px] font-medium uppercase tracking-wider transition-colors w-full ${
          isOpen ? "bg-surface-raised text-white" : "text-muted hover:text-white"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
        Сортировка
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="space-y-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSort(option.id)}
                className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                  currentSort === option.id
                    ? "bg-white text-black font-medium"
                    : "text-white hover:bg-surface-raised"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}