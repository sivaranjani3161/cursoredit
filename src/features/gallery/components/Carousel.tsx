"use client";

import { useState, useEffect } from "react";

const slides = [
  "/galcorousel1.png",
  "/galcorousel2.png",
  "/gal6.png",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setIndex((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setIndex((p) => (p + 1) % slides.length);

  return (
    <div className="
      relative overflow-hidden

      h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px]

      w-full
      rounded-none sm:rounded-xl
    ">
      {/* Image */}
      <img
        src={slides[index]}
        alt="carousel"
        className="w-full h-full object-cover transition-all duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-center bg-black/30 px-4">
        <div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold">
            Our Awesome Clicks
          </h2>
          <p className="text-sm sm:text-lg">@ finestcoder</p>
        </div>
      </div>

      {/* Arrows (hidden on mobile) */}
      <button
        onClick={prev}
        className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white"
      >
        ←
      </button>

      <button
        onClick={next}
        className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white"
      >
        →
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-teal-400" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}