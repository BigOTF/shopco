"use client"
import ProductListPage from "@/components/ProductListPage";
import { useTopSelling } from "@/hooks/useTopSelling";

export default function Page() {
  const { allProducts, isLoading, currentPage, setCurrentPage } = useTopSelling();
  return (
    <ProductListPage
      title="Top Selling"
      breadcrumb="Top Selling"
      href="/topSelling"
      detailHref="/topSelling"
      allProducts={allProducts}
      isLoading={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      filterCategories={[
        { label: "All", value: "" },
        { label: "Shoes (Women)", value: "womens-shoes" },
        { label: "Shoes (Men)", value: "mens-shoes" },
        { label: "Bags", value: "womens-bags" },
        { label: "Jewellery", value: "womens-jewellery" },
        { label: "Sunglasses", value: "sunglasses" },
      ]}
    />
  );
}