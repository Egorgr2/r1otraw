import type { Metadata } from "next";
import { TelegramProvider } from "@/components/TelegramProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SHOP_NAME ?? "Resale Shop",
  description: "Telegram Mini App — магазин одежды на реселле",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-black text-white">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
