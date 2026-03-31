"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import StarRating from "@/components/UI/StarRating";
import { useApp } from "@/context/AppContext";
import type { FilterState } from "@/context/AppContext";

type Review_props = {
    comment: string
    rating: number
    reviewerName: string
    reviewerEmail: string
    date: string
}

type Product_Props = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  availabilityStatus: string;
  tags: string[];
  reviews: Review_props[]
};

export default function ProductPage() {
    const params = useParams();
    const router = useRouter()
    const id = params.id;
    const { dispatch, state } = useApp();

    const [product, setProduct] = useState<Product_Props | null>(null);
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1);
    const originalPrice = ((product?.price ?? 0) / (1 - (product?.discountPercentage ?? 0) / 100)).toFixed(2)

    const [activeTab, setActiveTab] = useState<'rating' | 'faq'>('rating');
    const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(3);
    const [isLoadedAll, setIsLoadedAll] = useState(false);

    const tabs = [
        { id: 'rating', label: 'Rating & Reviews' },
        { id: 'faq', label: 'FAQs' },
    ] as const;

    const reviewSortOptions = [
        { label: "Latest", value: "latest" },
        { label: "Oldest", value: "oldest" },
        { label: "Highest Rated", value: "highest" },
        { label: "Lowest Rated", value: "lowest" },
    ];
    const [isReviewSortOpen, setIsReviewSortOpen] = useState(false);
    const currentReviewSort = reviewSortOptions.find((s) => s.value === state.filter.reviewSort);

    // Sorted reviews
    const sortedReviews = useMemo(() => {
    if (!product?.reviews) return [];
    return [...product.reviews].sort((a, b) => {
        if (state.filter.reviewSort === "latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (state.filter.reviewSort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (state.filter.reviewSort === "highest") return b.rating - a.rating;
        if (state.filter.reviewSort === "lowest") return a.rating - b.rating;
        return 0;
    });
    }, [product?.reviews, state.filter.reviewSort]);

    useEffect(() => {
        const fetchProduct = async () => {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
        };

        if (id) fetchProduct();
    }, [id]);

    useEffect(() => {
        const updateInitialCount = () => {
            if (!product?.reviews) return;
            
            const isLargeScreen = window.innerWidth >= 1024;
            const initialCount = isLargeScreen ? 6 : 3;
            
            setVisibleReviews(initialCount);
            setIsLoadedAll(false);
        };

        updateInitialCount();

        window.addEventListener('resize', updateInitialCount);
        return () => window.removeEventListener('resize', updateInitialCount);
    }, [product?.reviews]);
  
  return (
    <main className="max-w-360 w-full flex flex-col">

       <nav aria-label="breadcrumb" className="flex items-center gap-1.5 lg:gap-3 px-7 pt-6 lg:px-25">
            <Link href="/" className="flex items-center gap-1">
                <p className="text-sm lg:text-base text-black/60">Home</p>
                <Icon icon="weui:arrow-filled" width="12" height="24" className="text-black/60" />
            </Link>

            <button onClick={() => router.back()} className="flex items-center gap-1">
                <p className="text-sm lg:text-base text-black/60">New Arrivals</p>
                <span>
                    <Icon icon="weui:arrow-filled" width="12" height="24" className="text-black/60" />
                </span>
            </button>

            <p className="text-sm lg:text-base">{product?.title}</p>
        </nav>

        <main className=" px-7 py-10 lg:pt-6 lg:px-25 flex flex-col gap-10">

            <section className="flex flex-col gap-5 lg:flex-row lg:gap-10">

                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Mobile Main image */}
                    <div className="bg-[#F0EEED] w-full h-72.5 lg:h-132.5 rounded-[20px] overflow-hidden lg:hidden">
                        <img
                            src={product?.images[selectedImage]}
                            alt={product?.title}
                            className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                        />
                    </div>

                    {/* Thumbnail strip — mobile: draggable slider, desktop: vertical column */}
                    <div className="lg:hidden overflow-hidden">
                        <motion.div
                        className="flex gap-3"
                        drag="x"
                        dragConstraints={{ right: 0, left: -((product?.images?.length ?? 0) * 120 - 300) }}
                        dragElastic={0.05}
                        dragMomentum={false}
                        >
                        {product?.images.map((img, i) => (
                            <motion.button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`w-28 h-26.5 rounded-[20px] overflow-hidden border transition-all duration-200 shrink-0 bg-[#F0EEED]
                                ${selectedImage === i ? "border-black" : "border-transparent opacity-60"}`}
                            >
                            <img src={img} alt="" className="w-full h-full object-contain" />
                            </motion.button>
                        ))}
                        </motion.div>
                    </div>

                    {/* Desktop thumbnail column */}
                    <div className="hidden lg:flex flex-col gap-3">
                        {product?.images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`w-38 h-46.5 rounded-[20px] overflow-hidden border transition-all duration-200 shrink-0 bg-[#F0EEED]
                            ${selectedImage === i ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-contain" />
                        </button>
                        ))}
                    </div>

                    {/* Main image */}
                    <div className="bg-[#F0EEED] w-111 h-80 lg:h-132.5 rounded-[20px] overflow-hidden hidden lg:flex">
                        <img
                            src={product?.images[selectedImage]}
                            alt={product?.title}
                            className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                        />
                    </div>

                </div>

                <div className="flex flex-col gap-6 lg:gap-10">

                    <div className="flex flex-col gap-2">
                        <p className="font-bebas font-bold text-2xl lg:text-[40px] tracking-[0%]">{product?.title}</p>
                        {product && <StarRating rating={product.rating} />}
                        {product && (
                            <div className="flex items-center gap-2.5 lg:gap-3">
                                <p className="font-bold text-2xl lg:text-[32px]">${product.price}</p>
                                <p className="font-bold text-2xl lg:text-[32px] text-black/40 line-through">${originalPrice}</p>
                                {product.discountPercentage > 0 && (
                                    <span className="w-15.5 h-7.75 lg:w-18 lg:h-8.5 py-1.5 rounded-[62px] flex items-center justify-center bg-[#FF3333]/10 font-medium text-sm lg:text-base text-[#FF3333]">
                                        -{Math.round(product.discountPercentage)}%
                                    </span>
                                )}
                            </div>
                        )}
                        <p className="text-sm lg:text-base text-black/60">{product?.description}</p>
                    </div>

                    <div className="border border-black/10" />

                    <div className="flex items-center gap-3">
                        <div className="bg-[#F0F0F0] w-27.5 h-11 px-4 py-3 lg:w-42.5 lg:h-13 lg:px-5 lg:py-4 rounded-[62px] flex items-center justify-between">
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                                <Icon icon="ic:round-minus" width="24" height="24" color="black" />
                            </button>

                            <p className="font-medium text-sm lg:text-base">{quantity}</p>

                            <button onClick={() => setQuantity((q) => q + 1)} className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                                <Icon icon="ic:round-plus" width="24" height="24" color="black" />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                if (!product) return;
                                dispatch({
                                type: "ADD_TO_CART",
                                payload: {
                                    id: product.id,
                                    title: product.title,
                                    price: product.price,
                                    thumbnail: product.thumbnail,
                                    quantity,
                                },
                                });
                            }}
                            className="w-59 h-11 lg:w-100 lg:h-13 px-13.5 py-4 rounded-[62px] bg-black text-white flex items-center justify-center"
                        >
                            <p className="font-medium text-sm lg:text-base">Add to Cart</p>
                        </button>
                    </div>

                </div>

            </section>

            <section className="">
                {/* Tab Buttons */}
                <div className="flex justify-center gap-2 mb-8 border-b border-black/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full lg:w-102.75 flex items-center justify-center py-3 text-base lg:text-xl rounded-t-lg transition-all duration-200 relative ${
                            activeTab === tab.id
                                ? 'text-black font-medium'
                                : 'text-black/60'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                    {activeTab === 'rating' && (
                        <motion.div
                            key="rating"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-end gap-1">
                                    <p className="font-bold text-xl lg:text-2xl">All Reviews</p>
                                    <p className="text-sm lg:text-base text-black/60">({product?.reviews?.length || 0})</p>
                                </div>

                                <div className="flex items-center gap-2 lg:gap-2.5">
                                    <div onClick={() => setIsMobileSortOpen(true)} className="w-10 h-10 lg:w-12 lg:h-12 py-4 rounded-[62px] bg-[#F0F0F0] flex items-center justify-center">
                                        <img src={"/icons/filter.svg"} className="object-contain" />
                                    </div>

                                    {/* Sort dropdown large screeen */}
                                    <div className="relative hidden lg:block">
                                        <motion.button
                                            onClick={() => setIsReviewSortOpen(!isReviewSortOpen)}
                                            whileTap={{ scale: 0.97 }}
                                            className="lg:h-12 flex items-center justify-between gap-3 px-5 py-4 bg-[#F0F0F0] rounded-[62px]"
                                        >
                                            <p className="text-sm lg:text-base font-medium">{currentReviewSort?.label}</p>
                                            <motion.div
                                                animate={{ rotate: isReviewSortOpen ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Icon icon="lsicon:up-filled" width="16" height="16" color="black" />
                                            </motion.div>
                                        </motion.button>

                                        <AnimatePresence>
                                            {isReviewSortOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute right-0 top-12 z-50 bg-white border border-black/10 rounded-2xl shadow-lg overflow-hidden w-48"
                                                >
                                                    {reviewSortOptions.map((option) => (
                                                    <motion.button
                                                        key={option.value}
                                                        onClick={() => {
                                                        dispatch({ type: "SET_REVIEW_SORT", payload: option.value as FilterState["reviewSort"] });
                                                        setIsReviewSortOpen(false);
                                                        }}
                                                        whileHover={{ backgroundColor: "#f5f5f5" }}
                                                        className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150
                                                        ${state.filter.reviewSort === option.value ? "font-semibold text-black" : "text-black/60"}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            {option.label}
                                                            {state.filter.reviewSort === option.value && (
                                                                <Icon icon="mingcute:check-fill" width="16" height="16" className="text-black" />
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Mobile bottom sheet sort */}
                                    <AnimatePresence>
                                    {isMobileSortOpen && (
                                        <>
                                        {/* Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsMobileSortOpen(false)}
                                            className="lg:hidden fixed inset-0 bg-black/40 z-40"
                                        />

                                        {/* Sheet */}
                                        <motion.div
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            exit={{ y: "100%" }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[30px] pb-8"
                                        >
                                            {/* Handle */}
                                            <div className="flex justify-center pt-4 pb-2">
                                            <div className="w-10 h-1 bg-black/20 rounded-full" />
                                            </div>

                                            {/* Title */}
                                            <div className="flex items-center justify-between px-6 py-3 border-b border-black/10">
                                            <p className="text-xl font-bold">Sort Reviews</p>
                                            <button onClick={() => setIsMobileSortOpen(false)}>
                                                <Icon icon="mingcute:close-fill" width="24" height="24" className="text-black/40" />
                                            </button>
                                            </div>

                                            {/* Options */}
                                            <div className="flex flex-col p-4 gap-2">
                                            {reviewSortOptions.map((option) => (
                                                <motion.button
                                                key={option.value}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    dispatch({ type: "SET_REVIEW_SORT", payload: option.value as FilterState["reviewSort"] });
                                                    setIsMobileSortOpen(false);
                                                }}
                                                className={`flex items-center justify-between px-4 py-3 rounded-full border transition-colors duration-200
                                                    ${state.filter.reviewSort === option.value
                                                    ? "bg-black text-white border-black"
                                                    : "border-black/10 text-black/60"
                                                    }`}
                                                >
                                                <p className="text-sm font-medium">{option.label}</p>
                                                {state.filter.reviewSort === option.value && (
                                                    <Icon icon="mingcute:check-fill" width="16" height="16" className="text-white" />
                                                )}
                                                </motion.button>
                                            ))}
                                            </div>
                                        </motion.div>
                                        </>
                                    )}
                                    </AnimatePresence>

                                    <button className="w-28.25 h-10 lg:w-41.5 lg:h-12 py-3 lg:py-4 px-4 lg:px-5 flex items-center justify-center rounded-[62px] bg-black text-white text-nowrap">
                                        <p className="font-medium lg:text-base text-xs">Write a Review</p>
                                    </button>

                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6 lg:gap-10 items-center">
                                <div className="grid lg:grid-cols-2 gap-5 w-full">
                                    {sortedReviews.slice(0, visibleReviews).map((review: Review_props, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="px-6 py-6 lg:px-8 lg:py-7 flex flex-col gap-6 rounded-[20px] border border-black/10"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-3 lg:gap-3.75">
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: review.rating }).map((_, i) => (
                                                            <span key={i} className="text-[#FFC633] text-[22px]">★</span>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-col gap-2 lg:gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <p className="font-bold text-base lg:text-xl">{review.reviewerName}</p>
                                                            <img src={"/icons/check.svg"} alt="checkmark" />
                                                        </div>
                                                        <p className="text-sm lg:text-base text-black/60">"{review.comment}"</p>
                                                    </div>
                                                </div>

                                                <button className="w-6 h-6 lg:flex items-center justify-center hidden">
                                                    <Icon icon="tabler:dots-filled" width="24" height="24" className="text-black/40" />
                                                </button>
                                            </div>

                                            <div>
                                                <p className="text-sm lg:text-base font-medium text-black/60">
                                                    Posted on {new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                                </p>
                                            </div>
                                        
                                        </motion.div>
                                    ))}
                                </div>

                                {sortedReviews.length > visibleReviews && !isLoadedAll && (
                                    <button 
                                        onClick={() => {
                                            const isLarge = window.innerWidth >= 1024;
                                            const newVisible = visibleReviews + (isLarge ? 6 : 3);
                                            
                                            setVisibleReviews(newVisible);
                                            
                                            if (newVisible >= sortedReviews.length) {
                                                setIsLoadedAll(true);
                                            }
                                        }}
                                        className="w-48.75 h-11.75 lg:w-57.5 lg:h-13 py-3.5 lg:py-4 border border-black/10 rounded-[62px] flex items-center justify-center"
                                    >
                                        <p className="font-medium text-sm lg:text-base">Load More Reviews</p>
                                    </button>
                                )}

                                {isLoadedAll && sortedReviews.length > 0 && (
                                    <p className="text-center text-black/60 mt-6 text-sm">You've reached the end of reviews</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'faq' && (
                        <motion.div
                        key="faq"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="space-y-6"
                        >
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                        
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-5">
                            <h3 className="font-medium mb-2">How long does delivery take?</h3>
                            <p className="text-gray-600">Usually 2-5 business days depending on your location.</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-5">
                            <h3 className="font-medium mb-2">Can I cancel my order?</h3>
                            <p className="text-gray-600">Yes, you can cancel within 24 hours of placing the order.</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-5">
                            <h3 className="font-medium mb-2">Do you offer refunds?</h3>
                            <p className="text-gray-600">Refunds are processed within 5-7 business days.</p>
                            </div>
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </section>



        </main>
     
    </main>
  );
}