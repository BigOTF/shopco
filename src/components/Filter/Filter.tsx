'use client'
import { useState } from "react";
import { Icon } from "@iconify/react"
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceRange } from "../UI/PriceTracker";

const categories = [
    { label: "All Clothes", value: "" },
    { label: "Tops", value: "tops" },
    { label: "Mens Shirts", value: "mens-shirts" },
    { label: "Womens Dresses", value: "womens-dresses" },
];

export default function Filter({
    onApply
}: {
    onApply?: () => void
}) {
    const { state, dispatch } = useApp()
    const [isClothesOpen, setIsClothesOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isRatingOpen, setIsRatingOpen] = useState(true);
    const [isDiscountOpen, setIsDiscountOpen] = useState(true);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true);
    const [localState, setLocalState] = useState({
        category: state.filter.category,
        priceRange: state.filter.priceRange as [number, number],
        minRating: state.filter.minRating,
        minDiscount: state.filter.minDiscount,
        availability: state.filter.availability,
    });

    return (
        <div className="w-full h-full lg:border border-black/10 px-6 py-5 flex flex-col justify-between gap-6 lg:rounded-[20px]">
            <div className="lg:flex items-center justify-between hidden">
                <p className="text-xl font-bold">Filters</p>
                <img src={"/icons/filter.svg"} alt="Filter_icon" className="object-contain" />
            </div>

            <div className="w-full border border-black/10" />

            {/* Clothes */}
            <div className="flex flex-col gap-5">
                <button
                    onClick={() => setIsClothesOpen(!isClothesOpen)} 
                    className="flex items-center justify-between"
                >
                    <p className="font-bold text-xl">Clothes</p>

                    <motion.div
                        animate={{ rotate: isClothesOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon icon="lsicon:up-filled" width="20" height="20" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isClothesOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setLocalState({ ...localState, category: cat.value })}
                                className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-colors duration-300
                                ${localState.category === cat.value
                                    ? "bg-black text-white border-black"
                                    : "border-black/10 hover:bg-gray-50 text-black/60"
                                }`}
                            >
                                {cat.label}
                            </button>
                            ))}
                        </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
            </div>

            {/* Price */}
            <div className="flex flex-col gap-5">
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)} 
                    className="flex items-center justify-between"
                >
                    <p className="font-bold text-xl">Price</p>

                    <motion.div
                        animate={{ rotate: isPriceOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon icon="lsicon:up-filled" width="20" height="20" />
                    </motion.div>
                </button>

                {isPriceOpen && <PriceRange localState={localState} setLocalState={setLocalState} />}

            </div>

            {/* Rating */}
            <div className="flex flex-col gap-5">
                <button
                    onClick={() => setIsRatingOpen(!isRatingOpen)} 
                    className="flex items-center justify-between"
                >
                    <p className="font-bold text-xl">Rating</p>

                    <motion.div
                        animate={{ rotate: isRatingOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon icon="lsicon:up-filled" width="20" height="20" />
                    </motion.div>
                </button>

                {isRatingOpen && (
                    <div className="flex flex-col gap-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                onClick={() => setLocalState({ ...localState, minRating: localState.minRating === star ? 0 : star })}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-full border transition-colors duration-200
                                    ${localState.minRating === star
                                    ? "bg-black text-white border-black"
                                    : "border-black/10 hover:bg-gray-50"
                                    }`}
                            >
                            {/* Stars */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Icon
                                        key={i}
                                        icon="mingcute:star-fill"
                                        width="16"
                                        height="16"
                                        className={i < star
                                            ? localState.minRating === star ? "text-white" : "text-yellow-400"
                                            : "text-black/20"
                                        }
                                    />
                                ))}
                            </div>

                            {/* Label */}
                            <p className={`text-sm font-medium ${localState.minRating === star ? "text-white" : "text-black/60"}`}>
                                {star === 5 ? "5 only" : `${star} & above`}
                            </p>
                            </button>
                        ))}
                    </div>
                )}

            </div>

            {/* Discount */}
            <div className="flex flex-col gap-5">
                <button
                    onClick={() => setIsDiscountOpen(!isDiscountOpen)} 
                    className="flex items-center justify-between"
                >
                    <p className="font-bold text-xl">Discount</p>

                    <motion.div
                        animate={{ rotate: isDiscountOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon icon="lsicon:up-filled" width="20" height="20" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isDiscountOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                        <div className="flex flex-col gap-3">
                            {[10, 20, 30, 40, 50].map((discount) => (
                            <button
                                key={discount}
                                onClick={() => setLocalState({ ...localState, minDiscount: localState.minDiscount === discount ? 0 : discount })}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-full border transition-colors duration-300
                                ${localState.minDiscount === discount
                                    ? "bg-black text-white border-black"
                                    : "border-black/10 hover:bg-gray-50"
                                }`}
                            >
                                <p className={`text-sm font-medium ${localState.minDiscount === discount ? "text-white" : "text-black/60"}`}>
                                    {discount}% & above
                                </p>
                            </button>
                            ))}
                        </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

             {/* Availability */}
            <div className="flex flex-col gap-5">
                <button
                    onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)} 
                    className="flex items-center justify-between"
                >
                    <p className="font-bold text-xl">Availability</p>

                    <motion.div
                        animate={{ rotate: isAvailabilityOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon icon="lsicon:up-filled" width="20" height="20" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isAvailabilityOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-col gap-3">
                            {[
                                { label: "All", value: "all" },
                                { label: "In Stock", value: "in-stock" },
                                { label: "Out of Stock", value: "out-of-stock" },
                            ].map((item) => (
                                <button
                                key={item.value}
                                onClick={() => setLocalState({ ...localState, availability: item.value as "all" | "in-stock" | "out-of-stock" })}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-full border transition-colors duration-200
                                    ${localState.availability === item.value
                                    ? "bg-black text-white border-black"
                                    : "border-black/10 hover:bg-gray-50"
                                    }`}
                                >
                                <p className={`text-sm font-medium ${localState.availability === item.value ? "text-white" : "text-black/60"}`}>
                                    {item.label}
                                </p>

                                {/* dot indicator */}
                                <div className={`w-2 h-2 rounded-full
                                    ${item.value === "in-stock" ? "bg-green-400" :
                                    item.value === "out-of-stock" ? "bg-red-400" :
                                    localState.availability === "all" ? "bg-white" : "bg-black/20"
                                    }`}
                                />
                                </button>
                            ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <motion.button
                onClick={() => {
                    dispatch({ type: "SET_CATEGORY", payload: localState.category });
                    dispatch({ type: "SET_PRICE_RANGE", payload: localState.priceRange });
                    dispatch({ type: "SET_MIN_RATING", payload: localState.minRating });
                    dispatch({ type: "SET_MIN_DISCOUNT", payload: localState.minDiscount });
                    dispatch({ type: "SET_AVAILABILITY", payload: localState.availability });
                    onApply?.(); 
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full h-12 rounded-[62px] flex items-center justify-center bg-black"
                >
                <p className="text-sm font-medium text-white">Apply Filter</p>
            </motion.button>

        </div>
    )
}