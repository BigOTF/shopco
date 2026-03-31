"use client"
import { useState, useMemo, useRef } from "react";
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import Filter from "@/components/Filter/Filter"
import AnimatedCard from "@/components/UI/AnimatedCard";
import Skeleton from "react-loading-skeleton";
import StarRating from "@/components/UI/StarRating";
import type { FilterState } from "@/context/AppContext";
import Link from "next/link";

const ITEMS_PER_PAGE = 9;
const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Discounted", value: "discount" },
];

type Props = {
  title: string;                    
  breadcrumb: string;               
  href: string;                   
  detailHref: string;              
  allProducts: any[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number | ((p: number) => number)) => void;
};

export default function ProductListPage({
  title,
  breadcrumb,
  href,
  detailHref,
  allProducts,
  isLoading,
  currentPage,
  setCurrentPage,
}: Props) {
  const { state, dispatch } = useApp();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const currentSort = sortOptions.find((s) => s.value === state.filter.sortBy);

  const filtered = useMemo(() => {
    return allProducts
      .filter((p) => !state.filter.category || p.category === state.filter.category)
      .filter((p) => p.price >= state.filter.priceRange[0] && p.price <= state.filter.priceRange[1])
      .filter((p) => !state.filter.minRating || p.rating >= state.filter.minRating)
      .filter((p) => !state.filter.minDiscount || p.discountPercentage >= state.filter.minDiscount)
      .filter((p) => {
        if (state.filter.availability === "in-stock") return p.availabilityStatus === "In Stock";
        if (state.filter.availability === "out-of-stock") return p.availabilityStatus === "Out of Stock";
        return true;
      })
      .sort((a, b) => {
        if (state.filter.sortBy === "price-low") return a.price - b.price;
        if (state.filter.sortBy === "price-high") return b.price - a.price;
        if (state.filter.sortBy === "rating") return b.rating - a.rating;
        if (state.filter.sortBy === "discount") return b.discountPercentage - a.discountPercentage;
        return 0;
      });
  }, [allProducts, state.filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  return (
    <main className="max-w-360 w-full flex flex-col">

      <nav aria-label="breadcrumb" className="flex items-center gap-1.5 lg:gap-3 px-7 pt-6 lg:px-25">
        <Link href="/" className="flex items-center gap-1">
          <p className="text-sm lg:text-base text-black/60">Home</p>
          <Icon icon="weui:arrow-filled" width="12" height="24" className="text-black/60" />
        </Link>
        <p className="text-sm lg:text-base">{breadcrumb}</p>
      </nav>

      <section className="px-7 py-10 lg:pt-6 lg:px-25 flex gap-7">
        <aside className="w-73.75 hidden lg:flex">
          <Filter />
        </aside>

        <main className="flex-1">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="font-bold text-2xl lg:text-[32px]">{title}</p>
              {!isLoading && (
                <div className="flex items-center gap-3">
                  <p className="text-sm lg:text-base text-black/60 text-nowrap">
                    Showing {startItem}–{endItem} of {filtered.length} products
                  </p>

                  <div className="lg:flex items-center gap-2 hidden">
                    <p className="text-base text-black/60 shrink-0">Sort by:</p>
                    <div className="relative">
                      <motion.button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 border border-black/10 rounded-full px-4 py-2"
                        whileTap={{ scale: 0.97 }}
                      >
                        <p className="text-sm font-medium">{currentSort?.label}</p>
                        <motion.div animate={{ rotate: isSortOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <Icon icon="lsicon:up-filled" width="16" height="16" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {isSortOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 top-11 z-50 bg-white border border-black/10 rounded-2xl shadow-lg overflow-hidden w-52"
                          >
                            {sortOptions.map((option) => (
                              <motion.button
                                key={option.value}
                                onClick={() => {
                                  dispatch({ type: "SET_SORT", payload: option.value as FilterState["sortBy"] });
                                  setIsSortOpen(false);
                                }}
                                whileHover={{ backgroundColor: "#f5f5f5" }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150
                                  ${state.filter.sortBy === option.value ? "font-semibold text-black" : "text-black/60"}`}
                              >
                                <div className="flex items-center justify-between">
                                  {option.label}
                                  {state.filter.sortBy === option.value && (
                                    <Icon icon="mingcute:check-fill" width="16" height="16" className="text-black" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden w-8 h-8 py-4 flex items-center justify-center bg-[#F0F0F0] rounded-[62px]">
                    <img src="/icons/filterMobile.svg" alt="filter_icon" className="object-contain" />
                  </button>
                </div>
              )}
            </div>

            {/* Products grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-5 w-full"
              >
                {isLoading ?
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-5">
                      <Skeleton height={296} borderRadius={20} baseColor="#F0EEED" highlightColor="#e0dedd" />
                      <div className="flex flex-col gap-2">
                        <Skeleton width="70%" height={20} />
                        <Skeleton width="40%" height={16} />
                        <Skeleton width="30%" height={24} />
                      </div>
                    </div>
                  ))
                :
                  paginated.map((product, index) => {
                    const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
                    return (
                      <AnimatedCard key={product.id} index={index}>
                        <Link href={`${detailHref}/${product.id}`} className="flex flex-col gap-4 cursor-pointer">
                          <div className="bg-[#F0EEED] w-full h-43.5 rounded-[13.42px] lg:h-74.5 lg:rounded-[20px] flex items-center justify-center overflow-hidden">
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-base lg:text-xl font-bold line-clamp-1">{product.title}</p>
                            <StarRating rating={product.rating} />
                            <div className="flex items-center gap-1.25 lg:gap-2.5">
                              <p className="font-bold text-xl lg:text-2xl">${product.price}</p>
                              <p className="font-bold text-xl lg:text-2xl text-black/40 line-through">${originalPrice}</p>
                              {product.discountPercentage > 0 && (
                                <span className="w-10.5 h-5 lg:w-14.5 lg:h-7 py-1.5 rounded-[62px] flex items-center justify-center bg-[#FF3333]/10 font-medium text-[10px] lg:text-xs text-[#FF3333]">
                                  -{Math.round(product.discountPercentage)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </AnimatedCard>
                    );
                  })
                }
              </motion.div>
            </AnimatePresence>

            <div className="border border-black/10 w-full" />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-27.5 h-9 py-2 rounded-lg border border-black/10 flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <Icon icon="mdi-light:arrow-left" width="24" height="24" />
                  <p className="font-medium text-sm">Previous</p>
                </motion.button>

                <div className="flex gap-0.5">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <motion.button
                        key={page}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors duration-200
                          ${currentPage === page ? "bg-black/6 text-black" : "text-black/50"}`}
                      >
                        {page}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-21.5 h-9 py-2 rounded-lg border border-black/10 flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <p className="font-medium text-sm">Next</p>
                  <Icon icon="mdi-light:arrow-right" width="24" height="24" />
                </motion.button>
              </div>
            )}
          </div>
        </main>
      </section>

      {/* Mobile filter panel */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              ref={panelRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[30px] max-h-[85vh] overflow-y-auto"
            >
              <motion.div
                className="flex justify-center pt-4 pb-2 sticky top-0 bg-white z-10 cursor-grab active:cursor-grabbing"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={(_, info) => {
                  if (panelRef.current) {
                    const newHeight = window.innerHeight - info.point.y;
                    const clamped = Math.min(Math.max(newHeight, 200), window.innerHeight * 0.92);
                    panelRef.current.style.maxHeight = `${clamped}px`;
                  }
                }}
              >
                <div className="w-10 h-1 bg-black/20 rounded-full" />
              </motion.div>
              <div className="flex items-center justify-between px-6 py-3">
                <p className="text-xl font-bold">Filters</p>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <Icon icon="mingcute:close-fill" width="24" height="24" className="text-black/40" />
                </button>
              </div>
              <Filter onApply={() => setIsMobileFilterOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}