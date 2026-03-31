"use client"
import { useState, useEffect, useRef } from "react"
import CountUp from "@/components/UI/CountUp"
import Image from "next/image"
import AnimatedCard from "@/components/UI/AnimatedCard"
import productsData from "@/data/products.json";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, useAnimationControls, useMotionValue, animate } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"
import StarRating from "@/components/UI/StarRating"

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  images: string[];
}

const INITIAL_COUNT = 4;

const testimonials = [
  { name: "Sarah M.",  text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.", rating: 5 },
  { name: "James K.",  text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",  rating: 4 },
  { name: "Amara T.",  text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",    rating: 5 },
  { name: "Chris P.",  text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",        rating: 4 },
  { name: "Linda O.",  text: "Customer service was top notch!",     rating: 5 },
  { name: "Derek W.",  text: "Fits perfectly, highly recommend.",   rating: 5 },
];

const row1 = [...testimonials, ...testimonials];
const row2 = [...testimonials, ...testimonials];

const TestimonialCard = ({ name, text, rating }: { name: string; text: string; rating: number }) => (
  <div className="min-w-[85vw] sm:min-w-90 lg:min-w-100 lg:w-100 p-6 lg:px-8 lg:py-7 rounded-[20px] border border-black/10">

    <div className="flex flex-col gap-3 lg:gap-3.75">
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-[#FFC633] text-[22px]">★</span>
        ))}
      </div>

      <div className="flex flex-col gap-2 lg:gap-3">
        <div className="flex items-center gap-1">
          <p className="font-bold text-base lg:text-xl">{name}</p>
          <img src={"/icons/check.svg"} alt="checkmark" />
        </div>
       <p className="text-sm lg:text-base text-black/60">"{text}"</p>
      </div>
    </div>

  </div>
);

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [topSelling, setTopSelling] = useState<Product[]>([])
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoading, setIsLoading] = useState(true);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const sellingContainerRef = useRef<HTMLDivElement>(null);
  const [sellingDragWidth, setSellingDragWidth] = useState(0);
  const [dragWidth, setDragWidth] = useState(0);
  const controls1 = useAnimationControls();
  const controls2 = useAnimationControls();
  const router = useRouter()

  // Seeded random — same seed = same shuffle
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

  // Seed based on today's date — changes daily, stable within the day
  const getDailySeed = () => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const clothingCategories = [
        "womens-dresses",
        "mens-shirts",
        "tops",
        "womens-shoes",
        "mens-shoes",
        "womens-bags",
        "womens-jewellery",
        "sunglasses",
      ];

      const responses = await Promise.all(
        clothingCategories.map((cat) =>
          fetch(`https://dummyjson.com/products/category/${cat}`).then((r) => r.json())
        )
      );

      const allClothes = responses.flatMap((r) => r.products);
      const seed = getDailySeed();

      // shuffle the full list with today's seed
      const shuffled = seededShuffle(allClothes, seed);

      // slice different portions for each section
      const arrivals = shuffled.slice(0, 20);
      const selling = shuffled.slice(20, 40);

      setAllProducts(allClothes);
      setNewArrivals(arrivals);
      setTopSelling(selling);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    controls1.start({ x: ["0%", "-50%"], transition: { duration: 55, repeat: Infinity, ease: "linear" } });
    controls2.start({ x: ["-50%", "0%"], transition: { duration: 55, repeat: Infinity, ease: "linear" } });
  }, []);

  const visibleProducts = allProducts.slice(0, visibleCount);
  const arrivalsProducts = newArrivals.slice(0, visibleCount);
  const sellingProducts = topSelling.slice(0, visibleCount);

  useEffect(() => {
    if (mobileContainerRef.current) {
      setDragWidth(
        mobileContainerRef.current.scrollWidth - mobileContainerRef.current.offsetWidth
      );
    }
  }, [arrivalsProducts])

  useEffect(() => {
    if (sellingContainerRef.current) {
      setSellingDragWidth(
        sellingContainerRef.current.scrollWidth - sellingContainerRef.current.offsetWidth
      );
    }
  }, [sellingProducts]);
  
  return (
    <main className="max-w-360 w-full flex flex-col">

      <section className="bg-[#F2F0F1] lg:h-165.75 flex flex-col lg:flex-row items-center px-7 pt-10 lg:py-10 lg:px-25 overflow-hidden">
        <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-4">
          <p className="font-bebas font-bold text-6xl leading-14 lg:text-[64px] lg:leading-16 lg:tracking-[0%] lg:w-144.25">FIND CLOTHES THAT MATCHES YOUR STYLE</p>
          <p className="text-sm leading-5 lg:text-base lg:leading-5.5 tracking-[0%] text-black/60 lg:w-136.25">Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
          <button className="w-full lg:w-52.5 h-13 py-4 rounded-[62px] flex items-center justify-center bg-black text-white">
            <p className="text-base font-medium">Shop Now</p>
          </button>

          <div className="grid grid-cols-2 lg:flex items-center gap-8 lg:mt-4">
            <div className="flex flex-col">
              <p className="font-bold text-2xl lg:text-[40px] w-16 lg:w-26.75">
                <CountUp to={200} suffix="+" />
              </p>
              <p className="text-xs lg:text-base leading-5.5 text-black/60 -mt-1.5 lg:-mt-0.5 text-nowrap">International Brands</p>
            </div>

            <div className="border border-black/10 h-18.5 lg:block hidden" />

            <div className="flex flex-col">
              <p className="font-bold text-2xl lg:text-[40px] w-22 lg:w-36.5">
                <CountUp to={2000} suffix="+" />
              </p>
              <p className="text-xs lg:text-base leading-5.5 text-black/60 -mt-1.5 lg:-mt-0.5 text-nowrap">High-Quality Products</p>
            </div>

            <div className="border border-black/10 h-18.5 lg:block hidden" />
            
            <div className="flex flex-col col-span-2 justify-self-center lg:col-span-1 lg:justify-self-auto">
              <p className="font-bold text-2xl lg:text-[40px] w-25.75 lg:w-42.75">
                <CountUp to={30000} suffix="+" />
              </p>
              <p className="text-xs lg:text-base leading-5.5 text-black/60 -mt-1.5 lg:-mt-0.5 text-nowrap">Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Image
            src="/images/new.png"
            alt="Hero_image"
            width={800}
            height={663}
            priority
            className="object-cover object-top lg:h-165.75 h-112 w-full lg:relative lg:translate-y-6 lg:z-10 will-change-transform transform-gpu"
          />
        </div>
      </section>

      <section className="bg-black py-8 lg:h-30.5 px-7 lg:px-25 overflow-hidden">
        <div className="flex items-center justify-center lg:justify-between h-full overflow-x-auto scrollbar-hide flex-wrap gap-8 lg:gap-0">
          {[
            { src: "/images/versaceLogo.png", mobileWidth: 116.74, desktopWidth: 166.48 },
            { src: "/images/zaraLogo.png", mobileWidth: 63.81, desktopWidth: 91 },
            { src: "/images/gucciLogo.png", mobileWidth: 109.39, desktopWidth: 156 },
            { src: "/images/pradaLogo.png", mobileWidth: 127, desktopWidth: 194 },
            { src: "/images/calvinLogo.png", mobileWidth: 134.84, desktopWidth: 206.79 },
          ].map((logo) => (
            <div key={logo.src} className="shrink-0">
              <img
                src={logo.src}
                className="object-contain h-auto w-(--logo-w) lg:w-(--logo-lg-w)"
                style={{
                  "--logo-w": `${logo.mobileWidth}px`,
                  "--logo-lg-w": `${logo.desktopWidth}px`,
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-5 px-7 py-10 lg:py-20 lg:px-25">
        <p className="font-bebas font-bold text-[32px] lg:text-5xl tracking-[0%]">NEW ARRIVALS</p>

        {/* Mobile screen */}
        <div ref={mobileContainerRef} className="lg:hidden w-full overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            className="flex gap-5 mt-5 pb-4"
            drag="x"
            dragConstraints={{ right: 0, left: -dragWidth }}
            dragElastic={0.05}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            whileTap={{ cursor: "grabbing" }}
          >
            {isLoading ?
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-5 min-w-[60vw] shrink-0">
                  <Skeleton height={296} borderRadius={20} baseColor="#F0EEED" highlightColor="#e0dedd" />
                  <div className="flex flex-col gap-2">
                    <Skeleton width="70%" height={20} />
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="30%" height={24} />
                  </div>
                </div>
              ))
            :
              arrivalsProducts.map((product, index) => (
                <AnimatedCard key={product.id} index={index}>
                  <Link href={`/arrivals/${product.id}`} className="flex flex-col gap-5 w-49.5">
                    <div className="bg-[#F0EEED] w-full h-49.5 rounded-[13.42px] flex items-center justify-center overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-base font-bold line-clamp-1">{product.title}</p>
                      <StarRating rating={product.rating} />
                      <p className="font-bold text-xl">${product.price}</p>
                    </div>
                  </Link>
                </AnimatedCard>
              ))
            }
          </motion.div>
        </div>

        {/* Large screen */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-x-5 gap-y-10 mt-5 w-full">
          {isLoading === true ? 
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-5">
                <Skeleton
                  height={296}
                  borderRadius={20}
                  baseColor="#F0EEED"
                  highlightColor="#e0dedd"
                />
                <div className="flex flex-col gap-2">
                  <Skeleton width="70%" height={20} />
                  <Skeleton width="40%" height={16} />
                  <Skeleton width="30%" height={24} />
                </div>
              </div>
            ))
          : 
            arrivalsProducts.map((product, index) => (
              <AnimatedCard key={product.id} index={index}>
                <Link href={`/arrivals/${product.id}`} className="flex flex-col gap-5">
                  <div className="bg-[#F0EEED] w-full h-50 rounded-[13.42px] lg:h-74.5 lg:rounded-[20px] flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-base lg:text-xl font-bold line-clamp-1">{product.title}</p>
                    <StarRating rating={product.rating} />
                    <p className="font-bold text-xl lg:text-2xl">${product.price}</p>
                  </div>
                </Link>
              </AnimatedCard>
            ))
          }
        </div>

        <button onClick={() => router.push("/arrivals")} className="border border-black/10 py-4 w-full h-11.5 lg:w-54.5 lg:h-13 rounded-[62px] flex items-center justify-center hover:bg-black/10 transition-colors duration-300">
          <p className="font-medium text-sm lg:text-base">View All</p>
        </button>
      </section>

      <div className="border border-black/10 h-0 mx-7 lg:mx-25" />

      <section className="flex flex-col items-center gap-5 px-7 py-10 lg:py-20 lg:px-25">
        <p className="font-bebas font-bold text-[32px] lg:text-5xl tracking-[0%]">Top Selling</p>

        {/* Mobile screen */}
        <div ref={sellingContainerRef} className="lg:hidden w-full overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            className="flex gap-5 mt-5 pb-4"
            drag="x"
            dragConstraints={{ right: 0, left: -sellingDragWidth }}
            dragElastic={0.05}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            whileTap={{ cursor: "grabbing" }}
          >
            {isLoading ?
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-5 min-w-[60vw] shrink-0">
                  <Skeleton height={296} borderRadius={20} baseColor="#F0EEED" highlightColor="#e0dedd" />
                  <div className="flex flex-col gap-2">
                    <Skeleton width="70%" height={20} />
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="30%" height={24} />
                  </div>
                </div>
              ))
            :
              sellingProducts.map((product, index) => (
                <AnimatedCard key={product.id} index={index}>
                  <Link href={`/topSelling/${product.id}`} className="flex flex-col gap-5 w-49.5">
                    <div className="bg-[#F0EEED] w-full h-50 rounded-[13.42px] flex items-center justify-center overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-base font-bold line-clamp-1">{product.title}</p>
                      <StarRating rating={product.rating} />
                      <p className="font-bold text-xl">${product.price}</p>
                    </div>
                  </Link>
                </AnimatedCard>
              ))
            }
          </motion.div>
        </div>

        {/* Large screen */}
        <div className="hidden lg:grid grid-cols-2 lg:grid-cols-4 space-x-5 space-y-10 mt-5 w-full">
          {isLoading ? 
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-5">
                <Skeleton
                  height={296}
                  borderRadius={20}
                  baseColor="#F0EEED"
                  highlightColor="#e0dedd"
                />
                <div className="flex flex-col gap-2">
                  <Skeleton width="70%" height={20} />
                  <Skeleton width="40%" height={16} />
                  <Skeleton width="30%" height={24} />
                </div>
              </div>
            ))
          : 
            sellingProducts.map((product, index) => (
              <AnimatedCard key={product.id} index={index}>
                <Link href={`/topSelling/${product.id}`} className="flex flex-col gap-5">
                  <div className="bg-[#F0EEED] w-full h-50 rounded-[13.42px] lg:h-74.5 lg:rounded-[20px] flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-base lg:text-xl font-bold line-clamp-1">{product.title}</p>
                    <StarRating rating={product.rating} />
                    <p className="font-bold text-xl lg:text-2xl">${product.price}</p>
                  </div>
                </Link>
              </AnimatedCard>
            ))
          }
        </div>

        <button onClick={() => router.push("/topSelling")} className="border border-black/10 py-4 w-full h-11.5 lg:w-54.5 lg:h-13 rounded-[62px] flex items-center justify-center hover:bg-black/10 transition-colors duration-300">
          <p className="font-medium text-sm lg:text-base">View All</p>
        </button>

      </section>

      <section className="bg-[#F0F0F0] px-7 py-10 lg:py-16 lg:px-25 flex flex-col gap-5 lg:gap-10 items-center justify-center">
        <p className="font-bebas font-bold text-[32px] lg:text-5xl tracking-[0%]">BROWSE BY dress STYLE</p>

        <div className="flex flex-wrap items-center justify-center gap-5 lg:gap-8 w-full">
          {[
            { label: "Casual", img: "/images/casual.png", size: "w-full sm:w-101.75", href: "/category/casual" },
            { label: "Formal", img: "/images/formal.png", size: "w-full sm:w-171",    href: "/category/formal" },
            { label: "Party",  img: "/images/party.png",  size: "w-full sm:w-171",    href: "/category/party"  },
            { label: "Gym",    img: "/images/gym.png",    size: "w-full sm:w-101.75", href: "/category/gym"    },
          ].map(({ label, img, size, href }) => (
            <Link key={label} href={href} className={`relative h-72.25 ${size} rounded-[20px] overflow-hidden cursor-pointer block`}>
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${img}')` }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />

                <p className="absolute top-4 left-6 lg:left-9 z-10 font-bold text-2xl lg:text-4xl">
                  {label}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>

      </section>

      <section className="py-10 lg:py-16 flex flex-col gap-5 lg:gap-10">
        <div className="px-7 lg:px-25">
          <p className="font-bebas font-bold text-[32px] lg:text-5xl tracking-[0%]">OUR HAPPY CUSTOMERS</p>
        </div>
      
        {/* Row 1 — scrolls left */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-5"
            animate={controls1}
          >
            {row1.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </motion.div>
        </div>
        
        {/* Row 2 — scrolls right */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-5"
            animate={controls2}
          >
            {row2.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
}