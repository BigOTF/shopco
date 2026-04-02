"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [allProducts, setAllProducts] = useState<any[]>([])
    const router = useRouter()
    const { state } = useApp();
    const cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);

    const shopItems = [
        { label: "Shirt", href: "/shirt" },
        { label: "Pants", href: "/pant" },
        { label: "Shorts", href: "/shorts" },
    ]

    useEffect(() => {
        const fetchAll = async () => {
            const categories = [
            "womens-dresses", "mens-shirts", "tops", "womens-shoes",
            "mens-shoes", "womens-bags", "womens-jewellery", "sunglasses",
            ];
            const responses = await Promise.all(
            categories.map((cat) =>
                fetch(`https://dummyjson.com/products/category/${cat}`).then((r) => r.json())
            )
            );
            setAllProducts(responses.flatMap((r) => r.products));
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setSearchResults([]);
            return;
        }
        const results = allProducts
            .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 6);
        setSearchResults(results);
    }, [search, allProducts]);

    return (
        <header className="max-w-360 w-full px-7 py-5 lg:py-7 lg:px-25 sticky top-0 z-30 bg-white border-b border-black/10">
            {/* Large screen */}
            <div className="w-full h-12 lg:flex items-center lg:gap-10 hidden">
                <button onClick={() => router.push("/")}>
                    <Image 
                        src={"/images/brand.png"}
                        alt="brand"
                        width={160}
                        height={22}
                    />
                </button>

                <nav className="flex items-center gap-6">
                    <div
                        className="relative"
                        onMouseEnter={() => setShopOpen(true)}
                        onMouseLeave={() => setShopOpen(false)}
                    >
                        <button className="flex items-center gap-1">
                            <span className="text-base text-black">Shop</span>
                            <motion.div
                                animate={{ rotate: shopOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon icon="ic:baseline-arrow-drop-down" width="20" height="20" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {shopOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                            >
                                {shopItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                >
                                    {item.label}
                                </Link>
                                ))}
                            </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="#sale" className="text-base text-black text-nowrap">On Sale</Link>
                    <Link href="#new-arrivals" className="text-base text-black text-nowrap">New Arrivals</Link>        
                          
                </nav>

                <div className="bg-[#F0F0F0] w-144.25 h-12 flex items-center gap-3 px-4 py-3 rounded-[62px]">
                    <Icon icon="cuida:search-outline" width="24" height="24" color="black" />
                    <input className="focus:outline-none text-base w-full"
                        type="search"
                        placeholder="Search for products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <AnimatePresence>
                        {searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-26 left-0 right-0 bg-white rounded-2xl shadow-lg border border-black/10 overflow-hidden z-50"
                        >
                            {searchResults.map((product) => (
                            <Link
                                key={product.id}
                                href={`/arrivals/${product.id}`}
                                onClick={() => { setSearch(""); setSearchResults([]); }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F0F0] transition-colors"
                            >
                                <img src={product.thumbnail} alt={product.title} className="w-10 h-10 object-contain rounded-lg bg-[#F0EEED]" />
                                <div className="flex flex-col">
                                <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                                <p className="text-xs text-black/60">${product.price}</p>
                                </div>
                            </Link>
                            ))}
                        </motion.div>
                        )}
                    </AnimatePresence>
                </div> 

                <div className="flex items-center gap-3.5">
                    <button onClick={() => router.push("/cart")} className="relative">
                        <Icon icon="mdi:cart-outline" width="24" height="24" color="black" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button>
                        <Icon icon="codicon:account" width="24" height="24" color="black" />
                    </button>
                </div>
            </div>

            {/* mobile screen */}
            <div className="relative lg:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMenuOpen(true)}>
                            <Icon icon="ci:hamburger-lg" width="24" height="24" />
                        </button>
                        
                        <Image 
                            onClick={() => router.push("/")}
                            src={"/images/brand.png"}
                            alt="brand"
                            width={126}
                            height={18}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setSearchOpen((prev) => !prev)}>
                            <Icon icon="cuida:search-outline" width="24" height="24" color="black" />
                        </button>

                        <button onClick={() => router.push("/cart")} className="relative">
                            <Icon icon="mdi:cart-outline" width="24" height="24" color="black" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button>
                            <Icon icon="codicon:account" width="24" height="24" color="black" />
                        </button>
                    </div>

                    {/* Expanding Search Bar */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="absolute left-0 right-0 top-full z-40 bg-white px-4 py-3 shadow-md"
                            >
                                <div className="bg-[#F0F0F0] flex items-center gap-3 px-4 py-3 rounded-full">
                                    <Icon icon="cuida:search-outline" width="20" height="20" color="black" />
                                    <input
                                        autoFocus
                                        className="focus:outline-none text-sm w-full bg-transparent"
                                        type="search"
                                        placeholder="Search for products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <AnimatePresence>
                                        {searchResults.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-14 left-0 right-0 bg-white rounded-2xl shadow-lg border border-black/10 overflow-hidden z-50"
                                        >
                                            {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/arrivals/${product.id}`}
                                                onClick={() => { setSearch(""); setSearchResults([]); }}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F0F0] transition-colors"
                                            >
                                                <img src={product.thumbnail} alt={product.title} className="w-10 h-10 object-contain rounded-lg bg-[#F0EEED]" />
                                                <div className="flex flex-col">
                                                <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                                                <p className="text-xs text-black/60">${product.price}</p>
                                                </div>
                                            </Link>
                                            ))}
                                        </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button onClick={() => setSearchOpen(false)}>
                                        <Icon icon="ic:baseline-close" width="18" height="18" color="black" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Hamburger Drawer Overlay */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            className="fixed inset-0 z-50 flex lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/40"
                                onClick={() => setMenuOpen(false)}
                            />

                            {/* Drawer */}
                            <motion.div
                                className="relative z-10 bg-white w-70 h-full flex flex-col py-8 px-6 gap-6 overflow-y-auto"
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                            {/* Close button */}
                            <div className="flex items-center justify-between">
                                <Image
                                    src={"/images/brand.png"}
                                    alt="brand"
                                    width={120}
                                    height={18}
                                />
                                <button onClick={() => setMenuOpen(false)}>
                                    <Icon icon="ic:baseline-close" width="24" height="24" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <div className="flex flex-col gap-1">
                                {/* Shop with accordion */}
                                <button
                                    onClick={() => setShopOpen((prev) => !prev)}
                                    className="flex items-center justify-between py-3 border-b border-gray-100"
                                >
                                <span className="text-base font-medium text-black">Shop</span>
                                <motion.div
                                    animate={{ rotate: shopOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon icon="ic:baseline-arrow-drop-down" width="22" height="22" />
                                </motion.div>
                                </button>

                                <AnimatePresence>
                                    {shopOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                        <div className="flex flex-col pl-4 pb-2">
                                            {shopItems.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={() => setMenuOpen(false)}
                                                className="py-2.5 text-sm text-gray-600 hover:text-black transition-colors border-b border-gray-50"
                                            >
                                                {item.label}
                                            </Link>
                                            ))}
                                        </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Link
                                    href="#sale"
                                    onClick={() => setMenuOpen(false)}
                                    className="py-3 text-base font-medium text-black border-b border-gray-100"
                                >
                                    On Sale
                                </Link>

                                <Link
                                    href="#new-arrivals"
                                    onClick={() => setMenuOpen(false)}
                                    className="py-3 text-base font-medium text-black border-b border-gray-100"
                                >
                                    New Arrivals
                                </Link>
                            </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}