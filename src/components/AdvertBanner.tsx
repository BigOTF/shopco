"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function AdvertBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden bg-black text-white w-full h-9.5"
        >
          <div className="flex items-center justify-center relative py-2.25">
            <p className="text-xs lg:text-sm">
              Sign up and get 20% off to your first order.{" "}
              <span className="underline cursor-pointer font-medium">
                <Link href="/">Sign Up Now</Link>
              </span>
            </p>

            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hidden lg:flex"
            >
              <Icon
                icon="ic:baseline-close"
                width="18"
                height="18"
                color="white"
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}