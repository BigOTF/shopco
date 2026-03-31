"use client";
import { useRef, useState, useCallback } from "react";
import { Dispatch, SetStateAction } from "react";

type LocalStateProps = {
  category: string;
  priceRange: [number, number];
  minRating: number;
  minDiscount: number;
  availability: "all" | "in-stock" | "out-of-stock";
}

const MIN = 0;
const MAX = 500;

export const PriceRange = ({
  localState,
  setLocalState
}: {
  localState: LocalStateProps
  setLocalState: Dispatch<SetStateAction<{
    category: string;
    priceRange: [number, number];
    minRating: number;
    minDiscount: number;
    availability: "all" | "in-stock" | "out-of-stock";
}>>
}) => {
  const [minVal, maxVal] = localState.priceRange;
  const rangeRef = useRef<HTMLDivElement>(null);

  const getPercent = (value: number) => Math.round(((value - MIN) / (MAX - MIN)) * 100);

  const handleMinDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const startVal = minVal;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const rect = rangeRef.current?.getBoundingClientRect();
      if (!rect) return;

      const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const newVal = Math.round(percent * (MAX - MIN) + MIN);
      const clamped = Math.min(newVal, maxVal - 10);
      setLocalState(prev => ({ ...prev, priceRange: [clamped, maxVal] }));
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  }, [minVal, maxVal, setLocalState]);

  const handleMaxDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const rect = rangeRef.current?.getBoundingClientRect();
      if (!rect) return;

      const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const newVal = Math.round(percent * (MAX - MIN) + MIN);
      const clamped = Math.max(newVal, minVal + 10);
      setLocalState(prev => ({ ...prev, priceRange: [minVal, clamped] }));
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  }, [minVal, maxVal, setLocalState]);

  return (
    <div className="flex flex-col h-10.75 justify-between w-full">

      {/* Track */}
      <div ref={rangeRef} className="relative h-1.5 bg-[#F0F0F0] rounded-full">

        {/* Active range fill */}
        <div
          className="absolute h-1.5 bg-black rounded-full"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`,
          }}
        />

        {/* Min handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-black rounded-full cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${getPercent(minVal)}%` }}
          onMouseDown={handleMinDrag}
          onTouchStart={handleMinDrag}
        />

        {/* Max handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-black rounded-full cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${getPercent(maxVal)}%` }}
          onMouseDown={handleMaxDrag}
          onTouchStart={handleMaxDrag}
        />
      </div>

      {/* Price labels under handles */}
      <div className="relative h-5">
        <span
          className="absolute -translate-x-1/2 text-sm font-medium"
          style={{ left: `${getPercent(minVal)}%` }}
        >
          ${minVal}
        </span>
        <span
          className="absolute -translate-x-1/2 text-sm font-medium"
          style={{ left: `${getPercent(maxVal)}%` }}
        >
          ${maxVal}
        </span>
      </div>

    </div>
  );
};