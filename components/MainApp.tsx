"use client";

import { useState } from "react";
import { Header, type Tab } from "@/components/Header";
import { CatalogTab } from "@/components/tabs/CatalogTab";
import { ReviewsTab } from "@/components/tabs/ReviewsTab";
import { SellerTab } from "@/components/tabs/SellerTab";

type MainAppProps = {
  shopName: string;
  sellerUsername: string;
  sellerPhoto: string;
  sellerDescription: string;
};

export function MainApp({
  shopName,
  sellerUsername,
  sellerPhoto,
  sellerDescription,
}: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");

  return (
    <main className="min-h-screen pb-6">
      <Header
        shopName={shopName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "catalog" && <CatalogTab />}
      {activeTab === "reviews" && <ReviewsTab />}
      {activeTab === "seller" && (
        <SellerTab
          photo={sellerPhoto}
          name={shopName}
          description={sellerDescription}
          username={sellerUsername}
        />
      )}
    </main>
  );
}
