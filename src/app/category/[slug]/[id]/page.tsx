"use client";
import { useParams } from "next/navigation";
import ProductDetailPage from "@/components/ProductDetailPage";

export default function Page() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? "";

  const relatedCategoriesMap: Record<string, string[]> = {
    "tops": ["tops", "womens-tops"],
    "mens-shirts": ["mens-shirts", "mens-suits"],
    "womens-dresses": ["womens-dresses", "womens-tops"],
    "womens-shoes": ["womens-shoes", "mens-shoes"],
  };

  const labelMap: Record<string, string> = {
    "tops": "Casual",
    "mens-shirts": "Formal",
    "womens-dresses": "Party",
    "womens-shoes": "Gym",
  };

  const label = labelMap[slug] ?? slug;

  return (
    <ProductDetailPage
      backHref={`/category/${slug}`}
      backLabel={label}
      relatedCategories={relatedCategoriesMap[slug] ?? [slug]}
    />
  );
}