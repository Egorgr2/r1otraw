"use client";

import { Header } from "@/components/Header";

export default function ContactsPage() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "R1OTRAW";
  
  return (
    <div className="min-h-screen px-4 py-6">
      <Header shopName={shopName} />
      <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => window.location.href = "/"}
          className="text-white hover:text-muted mr-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-street">Контакты</h1>
      </div>

      <div className="flex flex-col gap-6 py-6">
        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3">Telegram</h2>
          <p className="text-sm text-white mb-4">@KOREAGRAVESS</p>
          <a
            href="https://t.me/KOREAGRAVESS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-white py-3 text-[10px] font-bold uppercase tracking-street text-black transition-colors hover:bg-gray-200 active:bg-gray-300 rounded text-center"
          >
            Связаться со мной
          </a>
        </div>

        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3">Время работы</h2>
          <p className="text-xs text-muted">Ежедневно с 10:00 до 22:00</p>
        </div>

        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3">Вопросы и заказы</h2>
          <p className="text-xs text-muted">
            По всем вопросам обращайтесь в Telegram. Ответим в течение 30 минут.
          </p>
        </div>
      </div>
    </div>
  );
}