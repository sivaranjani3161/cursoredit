"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import testimonialsData from "@/app/data/testimonials.json";

export default function Testimonials() {
  const items = testimonialsData.testimonials;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (paused) return;

    timeoutRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 2500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, paused, items.length]);

  const getPosition = (index: number) => {
    const diff = (index - active + items.length) % items.length;

    if (diff === 0) return "center";
    if (diff === 1) return "bottom";
    if (diff === items.length - 1) return "top";
    return "hidden";
  };

  return (
    <section className="w-full bg-[#0FA4AF] py-[50px] md:py-[80px] relative overflow-hidden px-4">

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-[30px] md:gap-[40px]">

        {/* LEFT TEXT */}
        <div className="md:w-[380px] text-white text-center md:text-left">
          <h2 className="text-[26px] sm:text-[32px] md:text-[48px] leading-[1.1] font-medium">
            What Our <br />
            <span className="font-bold">Learners Say</span>
          </h2>

          <p className="mt-[10px] md:mt-[12px] text-[13px] sm:text-[14px] md:text-[16px] opacity-90">
            Hear directly from learners who achieved their goals.
          </p>
        </div>

        {/* MOBILE SLIDER */}
        <div className="relative w-full max-w-[700px] overflow-hidden md:hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${active * 100}%)`,
            }}
          >
            {items.map((item, i) => (
              <div key={i} className="w-full flex-shrink-0 px-2">
                <Card item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP STACK */}
        <div className="hidden md:block relative w-full max-w-[700px] h-[560px] flex items-center justify-center top-[180px]">
          {items.map((item, i) => {
            const pos = getPosition(i);

            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`
                  absolute w-full max-w-[600px] left-1/2 -translate-x-1/2
                  transition-all duration-700 ease-in-out cursor-pointer

                  ${pos === "center" && "translate-y-0 scale-100 opacity-100 z-20"}
                  ${pos === "top" && "-translate-y-[240px] scale-[0.88] opacity-50 z-10"}
                  ${pos === "bottom" && "translate-y-[240px] scale-[0.88] opacity-50 z-10"}
                  ${pos === "hidden" && "opacity-0 pointer-events-none"}
                `}
              >
                <Card item={item} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* CARD */
function Card({ item }: any) {
  return (
    <div className="
      w-full min-h-[180px] sm:min-h-[200px] md:h-[210px]
      bg-[#F3F3F3]
      rounded-[12px]
      px-[16px] sm:px-[20px] md:px-[24px]
      py-[14px] sm:py-[16px] md:py-[18px]
      flex flex-col sm:flex-row justify-between gap-[12px]
    ">
      <div className="flex flex-col justify-center max-w-full sm:max-w-[440px] h-[120px] sm:h-[130px] overflow-hidden">
<Image
  src="/quote.png"
  alt="quote"
  width={18}
  height={18}
  className="w-[18px] h-[18px] shrink-0 mb-[4px]"
/>        <p className="text-[13px] sm:text-[14px] lg:text-[16px] line-clamp-5">
          {item.text}
        </p>
      </div>

      <div className="flex flex-row sm:flex-col items-center gap-[10px]">
<Image
  src={item.avatar}
  alt=""
  width={40}
  height={40}
  style={{ width: "auto", height: "auto" }}
  className="rounded-full"
/>
      <div className="text-center">
          <p className="text-[12px] font-semibold">{item.name}</p>
          <p className="text-[11px] text-[#666]">{item.role}</p>
        </div>
      </div>
    </div>
  );
}