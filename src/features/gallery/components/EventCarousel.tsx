"use client";

import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface Props {
  images: string[];
}

export default function EventCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
<div className="
  relative overflow-hidden
  h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px]

  w-screen left-1/2 -translate-x-1/2
  rounded-none

  sm:w-full sm:left-0 sm:translate-x-0
  sm:rounded-xl
">       <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden md:rounded-[20px]">

        <img
          src={images[index]}
          alt="carousel"
          className="w-full h-full object-cover transition duration-500"
        />

        <div className="absolute inset-0 bg-black/30" />

        {/* Arrows — desktop only */}
        <button
          onClick={prev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
        >
          <FiArrowLeft className="text-white text-base" />
        </button>

        <button
          onClick={next}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
        >
          <FiArrowRight className="text-white text-base" />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-3 sm:bottom-4 w-full flex justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
                i === index ? "bg-teal-400 w-4" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}