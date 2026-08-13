"use client";

import { useState } from "react";
import Link from "next/link";
import { HamburgerMenu } from "@/components/HamburgerMenu";

type HeaderProps = {
  shopName: string;
};

export function Header({ shopName }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 text-white hover:text-white/70 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wider">Меню</span>
          </button>
          
          <Link 
            href="/" 
            className="text-sm font-bold uppercase tracking-tight text-white hover:text-white/70 transition-colors brand-text"
          >
            {shopName}
          </Link>
          
          <a
            href="https://t.me/KOREAGRAVESS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-black border border-white px-3 py-1.5 hover:bg-red-600 hover:border-red-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            Связь
          </a>
        </div>
      </header>
      
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
