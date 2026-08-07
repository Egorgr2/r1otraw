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
          
          <Link href="/" className="text-sm font-medium uppercase tracking-street text-white hover:text-muted">
            {shopName}
          </Link>
          
          <div className="w-6" /> {/* Spacer for centering */}
        </div>
      </header>
      
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
