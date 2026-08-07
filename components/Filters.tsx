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
    { id: "available", label: "Наличие" },
    { id: "preorder", label: "Подзаказ" },
    { id: "preorder_long", label: "Предзаказ" },
  ];

  useEffect(() => {
    // Получаем уникальные бренды из товаров
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
          <polygon points="22 3 2 3 10 12l10 7 10-7z" />
          <line x1="12" y1="19" x2="12" y2="5" />
        </svg>
        Фильтры
        {hasActiveFilters && (
          <span className="ml-auto bg-white text-black px-2 py-0.5 rounded-full text-[9px]">
            {selectedStatuses.length + selectedBrands.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* Статусы */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white mb-3">
              Статусы
            </h3>
            <div className="space-y-2">
              {STATUSES.map((status) => (
                <label
                  key={status.id}
                  className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                    selectedStatuses.includes(status.id)
                      ? "border-white bg-white text-black"
                      : "border-surface-border text-white hover:border-white/50"
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
                  className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                    selectedBrands.includes(brand)
                      ? "border-white bg-white text-black"
                      : "border-surface-border text-white hover:border-white/50"
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

          {/* Сброс фильтров */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatuses([]);
                setSelectedBrands([]);
                onFilterChange({ statuses: [], brands: [] });
              }}
              className="text-[10px] uppercase tracking-wider text-muted underline"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
}