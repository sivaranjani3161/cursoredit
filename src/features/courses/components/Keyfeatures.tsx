"use client";

import { useState } from "react";
import Image from "next/image";
import data from "@/features/courses/data/Keyfeaturesdata.json";

export default function KeyFeatures() {
  const { sectionTitle, features } = data;

  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const leftCol = features.filter((_, i) => i % 2 === 0);
  const rightCol = features.filter((_, i) => i % 2 !== 0);

  const AccordionItem = ({ feature }: { feature: typeof features[0] }) => {
    const isOpen = openId === feature.id;
    return (
      <div
        className={`border rounded-[8px] px-4 py-3 cursor-pointer transition-all duration-200 ${
          isOpen
            ? "border-[#00B8C6] bg-white shadow-sm"
            : "border-[#E0E0E0] bg-white"
        }`}
        onClick={() => toggle(feature.id)}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[14px] sm:text-[15px] font-medium text-[#2E2E2E] leading-snug">
            {feature.title}
          </span>

          <Image
  src={isOpen ? "/minus.png" : "/plus.png"}
  alt={isOpen ? "collapse" : "expand"}
  width={isOpen ? 18 : 18}
  height={isOpen ? 4 : 18}
  style={{ 
    width: isOpen ? "18px" : "18px", 
    height: isOpen ? "4px" : "18px", 
    flexShrink: 0 
  }}
/>
        </div>

        {/* Expanded content */}
        {isOpen && feature.points.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {feature.points.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                {/* Tick icon — 13×13, no fill */}
                <Image
                  src="/rock.png"
                  alt="tick"
                  width={13}
                  height={13}
                  style={{ width: "13px", height: "13px", marginTop: "3px", flexShrink: 0 }}
                />
                <p className="text-[13px] text-[#464646] leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full bg-[#FDFDFD] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-[900px] mx-auto">

        {/* Section Title */}
        <h2 className="text-center text-[28px] sm:text-[36px] md:text-[42px] leading-[100%] mb-8 md:mb-12">
          <span className="font-medium text-[#2E2E2E]">{sectionTitle.normal}</span>
          <span className="font-bold text-[#2E2E2E]">{sectionTitle.bold}</span>
        </h2>

        {/* 2-column accordion grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Left column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {leftCol.map((feature) => (
              <AccordionItem key={feature.id} feature={feature} />
            ))}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {rightCol.map((feature) => (
              <AccordionItem key={feature.id} feature={feature} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}