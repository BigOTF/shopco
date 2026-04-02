import ProductDetailPage from "@/components/ProductDetailPage";

export default function Page() {
  return (
    <ProductDetailPage
      backHref="/topSelling"
      backLabel="Top Selling"
      relatedCategories={["womens-shoes", "mens-shoes", "womens-bags", "womens-jewellery", "sunglasses"]}
    />
  );
}