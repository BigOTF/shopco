import ProductDetailPage from "@/components/ProductDetailPage";

export default function Page() {
  return (
    <ProductDetailPage
      backHref="/arrivals"
      backLabel="New Arrivals"
      relatedCategories={["womens-dresses", "mens-shirts", "tops"]}
    />
  );
}