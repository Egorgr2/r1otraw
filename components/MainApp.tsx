"use client";

import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";

type MainAppProps = {
  shopName: string;
  sellerUsername: string;
  sellerPhoto: string;
  sellerDescription: string;
};

export function MainApp({
  shopName,
}: MainAppProps) {
  return (
    <main className="min-h-screen pb-6">
      <Header shopName={shopName} />
      <HomePage />
    </main>
  );
}
