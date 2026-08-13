"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type FiltersProps = {
  onFilterChange: (filters: {
    statuses: string[];
    brands: string[];
  }) => void;
};

export function Filters({ onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const STATUSES = [
    { id: "available", label: "В наличии" },
    { id: "soon_available", label: "Скоро в наличии" },
    { id: "preorder", label: "Подзаказ" },
    { id: "preorder_long", label: "Предзаказ" },
  ];

  useEffect(() => {
    // Получаем уникальные бренды из товаров
    if (!supabase) return;
    
    supabase
      .from("products")
      .select("brand")
      .not("brand", "is", null)
      .then(({ data, error }: { data: { brand: string }[] | null; error: any }) => {
        if (error) {
          console.error("Error fetching brands:", error);
          return;
        }
        const brands = data?.map(p => p.brand).filter((b): b is string => b !== null && b !== undefined) || [];
        const uniqueBrands = Array.from(new Set(brands));
        setAvailableBrands(uniqueBrands.sort());
      });
  }, []);

  const toggleStatus = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter(s => s !== statusId)
      : [...selectedStatuses, statusId];
    setSelectedStatuses(newStatuses);
    onFilterChange({ statuses: newStatuses, brands: selectedBrands });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    onFilterChange({ statuses: selectedStatuses, brands: newBrands });
  };

  const hasActiveFilters = selectedStatuses.length > 0 || selectedBrands.length > 0;

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedBrands([]);
    onFilterChange({ statuses: [], brands: [] });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-3 text-[10px] font-medium uppercase tracking-wider transition-colors border border-white/10 w-full ${
          hasActiveFilters ? "bg-red-600 border-red-600 text-white" : "bg-black text-white"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12l10 7 10-7z" />
          <line x1="12" y1="19" x2="12" y2="5" />
        </svg>
        Фильтры
        {hasActiveFilters && (
          <span className="ml-auto bg-white text-black px-2 py-0.5 rounded-full text-[9px] font-bold">
            {selectedStatuses.length + selectedBrands.length}
          </span>
        )}
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
          <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-white/10 rounded-t-2xl max-h-[80vh] overflow-y-auto slide-up">
            <div className="sticky top-0 bg-black border-b border-white/10 px-4 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider">Фильтры</h2>
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

            <div className="p-4 space-y-6">
              {/* Статусы */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white mb-3">
                  Статусы
                </h3>
                <div className="space-y-2">
                  {STATUSES.map((status) => (
                    <label
                      key={status.id}
                      className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedStatuses.includes(status.id)
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-white/10 text-white hover:border-white/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status.id)}
                        onChange={() => toggleStatus(status.id)}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Бренды */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white mb-3">
                  Бренды
                </h3>
                
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedBrands.includes(brand)
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-white/10 text-white hover:border-white/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="sr-only"
                      />
                      <span className="text-xs font-bold uppercase">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-wider border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >
                    Сбросить
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-wider bg-white text-black hover:bg-red-600 hover:text-white transition-colors"
                >
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}