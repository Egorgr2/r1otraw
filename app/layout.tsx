import type { Metadata, Viewport } from "next";
import { TelegramProvider } from "@/components/TelegramProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SHOP_NAME ?? "Resale Shop",
  description: "Telegram Mini App — магазин одежды на реселле",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="telegram:web-app" content="true" />
      </head>
      <body className="text-white">
        <div className="mx-auto max-w-md min-h-screen">
          <TelegramProvider>{children}</TelegramProvider>
        </div>
      </body>
    </html>
  );
}
