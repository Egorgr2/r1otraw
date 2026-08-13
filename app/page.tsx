import { MainApp } from "@/components/MainApp";

export default function HomePage() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "SHOP";
  const sellerUsername = process.env.NEXT_PUBLIC_SELLER_USERNAME ?? "KOREAGRAVESS";
  const sellerPhoto =
    process.env.NEXT_PUBLIC_SELLER_PHOTO ??
    "https://placehold.co/200x200/111111/ffffff?text=KG";
  const sellerDescription =
    process.env.NEXT_PUBLIC_SELLER_DESCRIPTION ??
    "Реселл винтажной и современной одежды.";

  return (
    <MainApp
      shopName={shopName}
      sellerUsername={sellerUsername}
      sellerPhoto={sellerPhoto}
      sellerDescription={sellerDescription}
    />
  );
}
