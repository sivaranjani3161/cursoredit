"use client";
import Image from "next/image";
import { useState } from "react";
import featuresData from "@/features/courses/data/Coursefeaturesdata.json";

export default function CourseFeatures() {
  const { features } = featuresData;
  const [activeIndex, setActiveIndex] = useState(0);
  const delays = ["[0ms]", "[150ms]", "[300ms]"];

  return (
    <section className="w-full bg-[#00B8C6] py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* ── MOBILE LAYOUT ── */}
      <div className="sm:hidden flex flex-col items-center gap-6">

        {/* Icon selector row */}
        <div className="flex items-center justify-center gap-4">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveIndex(index)}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                activeIndex === index ? "scale-125" : "scale-100"
              }`}
            >
              <div className={`w-[56px] h-[56px] rounded-xl bg-[#00B8C6] flex items-center justify-center transition-all duration-300 ${
                activeIndex === index
                  ? "border-[3px] border-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
                  : "border-[3px] border-transparent"
              }`}>
                <div className="relative w-8 h-8">
                  <Image
                    src={feature.icon}
                    alt={feature.iconAlt}
                    fill
                    sizes="32px"
                    className="object-contain brightness-0 invert"
                  />
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-white" : "bg-white/40"
              }`} />
            </button>
          ))}
        </div>

       {/* Active feature card — fixed size */}
<div className="bg-white rounded-[12px] px-6 py-8 w-full h-[260px] flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
  <div className="w-[56px] h-[56px] rounded-lg bg-[#00B8C6] flex items-center justify-center mb-4 flex-shrink-0">
    <div className="relative w-8 h-8">
      <Image
        src={features[activeIndex].icon}
        alt={features[activeIndex].iconAlt}
        fill
        className="object-contain brightness-0 invert"
      />
    </div>
  </div>
  <h3 className="font-semibold text-[#2E2E2E] text-[18px] leading-[130%] mb-2 flex-shrink-0">
    {features[activeIndex].titleLine1}
    {features[activeIndex].titleLine2 && (
      <><br />{features[activeIndex].titleLine2}</>
    )}
  </h3>
  <p className="text-[#2E2E2E]/70 text-[13px] leading-relaxed line-clamp-3 flex-shrink-0">
    {features[activeIndex].description}
  </p>
  <div className="mt-4 w-[40px] h-[2px] bg-[#00B8C6] rounded-full flex-shrink-0" />
</div>

        {/* Dots */}
        <div className="flex gap-2">
          {features.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── TAB & DESKTOP LAYOUT — untouched ── */}
      {/* ── TAB & DESKTOP LAYOUT — untouched ── */}
{/* ── TAB & DESKTOP LAYOUT ── */}
<div className="hidden sm:flex max-w-[1200px] mx-auto flex-row items-stretch justify-center gap-6 md:gap-8">
  {features.map((feature, index) => (
    <div
      key={feature.id}
      style={{
        animation: `fadeSlideUp 0.6s ease forwards`,
        animationDelay: `${index * 150}ms`,
      }}
      className="
        group bg-white rounded-[12px] flex flex-col items-center text-center
        px-6 py-8 flex-1
        min-h-[280px] sm:min-h-[310px] lg:min-h-[333px]
        shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]
        hover:-translate-y-2 transition-all duration-300 ease-out cursor-default
      "
    >
      <div className="w-[56px] h-[56px] rounded-lg bg-[#00B8C6] flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        <div className="relative w-8 h-8">
          <Image src={feature.icon} alt={feature.iconAlt} fill className="object-contain" />
        </div>
      </div>
      <h3 className="font-semibold text-[#2E2E2E] leading-[120%] tracking-normal mb-3 text-[18px] sm:text-[20px] md:text-[16px] lg:text-[22px] group-hover:text-[#00B8C6] transition-colors duration-300">
        {feature.titleLine1}<br />{feature.titleLine2}
      </h3>
      <p className="text-[#2E2E2E]/70 text-[14px] leading-relaxed font-normal group-hover:text-[#2E2E2E]/90 transition-colors duration-300">
        {feature.description}
      </p>
      <div className="mt-auto pt-5 w-0 group-hover:w-[40px] h-[2px] bg-[#00B8C6] rounded-full transition-all duration-500 ease-out" />
    </div>
  ))}
</div>

    </section>
  );
}