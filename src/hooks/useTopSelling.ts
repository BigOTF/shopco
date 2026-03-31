"use client";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 9;

const topSellingCategories = [
  "womens-shoes",
  "mens-shoes",
  "womens-bags",
  "womens-jewellery",
  "sunglasses",
];

const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getDailySeed = () => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

export const useTopSelling = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all(
        topSellingCategories.map((cat) =>
          window.fetch(`https://dummyjson.com/products/category/${cat}`).then((r) => r.json())
        )
      );
      const all = responses.flatMap((r) => r.products);
      const shuffled = seededShuffle(all, getDailySeed() + 1);
      setAllProducts(shuffled);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return { allProducts, isLoading, currentPage, setCurrentPage, ITEMS_PER_PAGE };
};