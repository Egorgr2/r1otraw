import { ProductPageClient } from "./ProductPageClient";

type PageProps = {
  params: { id: string };
};

export default function ProductPage({ params }: PageProps) {
  const sellerUsername =
    process.env.NEXT_PUBLIC_SELLER_USERNAME ?? "KOREAGRAVESS";

  return (
    <ProductPageClient
      productId={params.id}
      sellerUsername={sellerUsername}
    />
  );
}
