"use client"
import { useState } from "react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { useApp } from "@/context/AppContext"

export default function Cart() {
    const { state, dispatch } = useApp();
    const [promoCode, setPromoCode] = useState("");

    const DELIVERY_FEE = 15;

    const subtotal = state.cart.reduce((sum, item) => {
    const original = item.price / (1 - item.discountPercentage / 100);
    return sum + original * item.quantity;
    }, 0);

    const totalDiscount = state.cart.reduce((sum, item) => {
    const original = item.price / (1 - item.discountPercentage / 100);
    const discount = (original - item.price) * item.quantity;
    return sum + discount;
    }, 0);

    const total = subtotal - totalDiscount + DELIVERY_FEE;

    return (
        <main className=" max-w-360 w-ful flex flex-col gap-5 px-7 py-10 lg:py-10 lg:px-25">
            <nav aria-label="breadcrumb" className="flex items-center gap-1.5 lg:gap-3">
                <Link href="/" className="flex items-center gap-1">
                    <p className="text-sm lg:text-base text-black/60">Home</p>
                    <Icon icon="weui:arrow-filled" width="12" height="24" className="text-black/60" />
                </Link>
                <p className="text-sm lg:text-base">Cart</p>
            </nav>

            <p className="font-bebas font-bold text-[32px] lg:text-[40px] lg:tracking-[0%]">Your cart</p>

           <div className="flex flex-col lg:flex-row gap-5">

                {/* Cart items */}
                <div className="flex flex-col gap-4 flex-1">
                    {state.cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                        <Icon icon="mdi:cart-outline" width={80} height={80} className="text-black/20" />
                        <p className="mt-6 text-xl font-medium">Your cart is empty</p>
                        <p className="text-black/60 mt-2">Start shopping to add items</p>
                    </div>
                    ) : (
                    state.cart.map((item) => (
                        <div key={item.id} className="w-full p-3.5 lg:px-6 lg:py-5 flex flex-col gap-4 lg:gap-6 rounded-[20px] border border-black/10">
                        <div className="flex gap-3.5 lg:gap-4">
                            <div className="bg-[#F0EEED] w-24.75 h-24.75 lg:w-31 lg:h-31 rounded-[8.66px] flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
                                />
                            </div>

                            <div className="flex flex-col justify-between w-full">
                                <div className="flex items-start justify-between">
                                    <p className="font-bold text-base lg:text-xl">{item.title}</p>

                                    <button
                                        onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                                        className="w-6 h-6 flex items-center justify-center"
                                    >
                                        <Icon icon="mdi:delete" width="24" height="24" color="#FF3333" />
                                    </button>
                                
                                </div>

                                <div className="flex justify-between">
                                    <p className="font-bold text-xl lg:text-2xl">${item.price}</p>

                                    <div className="bg-[#F0F0F0] text-black h-7.75 lg:w-31.5 lg:h-11 px-3 lg:px-5 py-3.5 lg:py-3 rounded-[62px] flex items-center gap-5">
                                        <button onClick={() => dispatch({ type: "DECREMENT_QUANTITY", payload: item.id })}>
                                            <Icon icon="ic:round-minus" width="24" height="24" color="black" />
                                        </button>
                                        <span className="font-medium text-sm">{item.quantity}</span>
                                        <button onClick={() => dispatch({ type: "INCREMENT_QUANTITY", payload: item.id })}>
                                            <Icon icon="ic:round-plus" width="24" height="24" color="black" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))
                    )}
                </div>

                {/* Order summary */}
                <div className="w-full lg:w-126.25 p-5 lg:px-6 lg:py-5 flex flex-col gap-4 lg:gap-6 rounded-[20px] border border-black/10 h-fit">
                    <p className="font-bold text-xl">Order Summary</p>

                    <div className="flex flex-col gap-5 w-full">
                        <div className="flex items-center justify-between">
                            <p className="text-base lg:text-xl text-black/60">Subtotal</p>
                            <p className="font-bold text-base lg:text-xl">${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-base lg:text-xl text-black/60">Discount</p>
                            <p className="font-bold text-base lg:text-xl text-[#FF3333]">-${totalDiscount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-base lg:text-xl text-black/60">Delivery Fee</p>
                            <p className="font-bold text-base lg:text-xl">${DELIVERY_FEE.toFixed(2)}</p>
                        </div>

                    <div className="w-full border border-black/10" />

                        <div className="flex items-center justify-between">
                            <p className="text-base lg:text-xl font-bold">Total</p>
                            <p className="font-bold text-base lg:text-xl">${total.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-[#F0F0F0] flex-1 h-12 px-4 py-3 flex items-center gap-4 rounded-[62px]">
                            <Icon icon="mdi:tag-outline" width="24" height="24" className="text-black/40 shrink-0" />
                            <input
                            className="focus:outline-none w-full text-black/40 text-sm lg:text-base bg-transparent"
                            type="text"
                            placeholder="Add promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            />
                        </div>
                        <button className="w-22 lg:w-29.75 h-12 px-4 py-3 rounded-[62px] bg-black text-white flex items-center justify-center shrink-0">
                            <p className="font-medium text-sm lg:text-base">Apply</p>
                        </button>
                    </div>

                    <button className="w-full h-13.5 lg:h-15 py-4 rounded-[62px] bg-black text-white flex items-center justify-center gap-3">
                        <p className="font-medium text-sm lg:text-base">Go to Checkout</p>
                        <Icon icon="tabler:arrow-right" width="24" height="24" />
                    </button>
                </div>

            </div>
        </main>
    )
}