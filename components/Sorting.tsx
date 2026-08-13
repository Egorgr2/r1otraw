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
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-3 text-[10px] font-medium uppercase tracking-wider transition-colors border border-white/10 w-full bg-black text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
        {currentLabel}
      </button>

      {/* Bottom Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-white/10 rounded-t-2xl max-h-[60vh] overflow-y-auto slide-up">
            <div className="sticky top-0 bg-black border-b border-white/10 px-4 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider">Сортировка</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-red-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSort(option.id)}
                  className={`w-full text-left px-4 py-3 text-xs rounded-lg transition-colors border ${
                    currentSort === option.id
                      ? "border-red-600 bg-red-600 text-white font-bold"
                      : "border-white/10 text-white hover:border-white/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}