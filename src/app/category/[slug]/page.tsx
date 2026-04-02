"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductListPage from "@/components/ProductListPage";

export default function Page() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(`https://dummyjson.com/products/category/${slug}`);
      const data = await res.json();
      setAllProducts(data.products ?? []);
      setIsLoading(false);
    };

    fetchData();
  }, [slug]);

  const labelMap: Record<string, string> = {
    "tops": "Casual",
    "mens-shirts": "Formal",
    "womens-dresses": "Party",
    "womens-shoes": "Gym",
  };

  const label = labelMap[slug ?? ""] ?? slug ?? "";

  return (
    <ProductListPage
      title={label}
      breadcrumb={label}
      href={`/category/${slug}`}
      detailHref={`/category/${slug}`}
      allProducts={allProducts}
      isLoading={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
}