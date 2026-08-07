"use client";

import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";

export type Tab = "home" | "catalog" | "reviews" | "seller";

type HeaderProps = {
  shopName: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "ГЛАВНАЯ" },
  { id: "catalog", label: "КАТАЛОГ" },
  { id: "reviews", label: "ОТЗЫВЫ" },
  { id: "seller", label: "ПРОДАВЕЦ" },
];

export function Header({ shopName, activeTab, onTabChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-surface-border bg-black/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-white hover:text-muted"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          
          <h1 className="text-sm font-medium uppercase tracking-street">
            {shopName}
          </h1>
          
          <div className="w-6" /> {/* Spacer for centering */}
        </div>
        
        <nav className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 border-b py-3 text-[10px] font-medium uppercase tracking-street transition-colors ${
                activeTab === tab.id
                  ? "border-white text-white"
                  : "border-transparent text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
