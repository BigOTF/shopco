"use client"
import ProductListPage from "@/components/ProductListPage";
import { useArrivals } from "@/hooks/useArrivals";

export default function Page() {
  const { allProducts, isLoading, currentPage, setCurrentPage } = useArrivals();
  return (
    <ProductListPage
        title="New Arrivals"
        breadcrumb="New Arrivals"
        href="/arrivals"
        detailHref="/arrivals"
        allProducts={allProducts}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filterCategories={[
            { label: "All", value: "" },
            { label: "Tops", value: "tops" },
            { label: "Mens Shirts", value: "mens-shirts" },
            { label: "Womens Dresses", value: "womens-dresses" },
        ]}
    />
  );
}