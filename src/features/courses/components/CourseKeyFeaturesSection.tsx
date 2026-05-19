"use client";

import { useState } from "react";
import type { Course, CourseFeature } from "@/features/courses/types/course";

function AccordionItem({
  feature,
  isOpen,
  onToggle,
}: {
  feature: CourseFeature;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-[8px] px-4 py-3 cursor-pointer transition-all duration-200 ${
        isOpen ? "border-[#00B8C6] bg-white shadow-sm" : "border-[#E0E0E0] bg-white"
      }`}
      onClick={onToggle}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] sm:text-[15px] font-medium text-[#2E2E2E] leading-snug">
          {feature.title}
        </span>

        <span
          className={`shrink-0 transition-transform duration-200 text-[#00B8C6] text-lg leading-none ${isOpen ? "" : ""}`}
        >
          {isOpen ? (
            <svg width="18" height="4" viewBox="0 0 18 4" fill="none">
              <rect y="0.5" width="18" height="3" rx="1.5" fill="#00B8C6" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect y="7.5" width="18" height="3" rx="1.5" fill="#00B8C6" />
              <rect x="7.5" width="3" height="18" rx="1.5" fill="#00B8C6" />
            </svg>
          )}
        </span>
      </div>

      {/* Expanded points */}
      {isOpen && (feature.description ?? []).length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {(feature.description ?? []).map((point, i) => (
            <div key={i} className="flex items-start gap-2">
              <svg
                className="w-[13px] h-[13px] shrink-0 mt-[3px] text-[#00B8C6]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-[13px] text-[#464646] leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseKeyFeaturesSection({ course }: { course: Course }) {
  const features = course.courseFeatures ?? [];
  const [openId, setOpenId] = useState<number | null>(features[0]?.id ?? null);

  if (features.length === 0) return null;

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  // Split into two columns (odd / even index)
  const leftCol = features.filter((_, i) => i % 2 === 0);
  const rightCol = features.filter((_, i) => i % 2 !== 0);

  return (
    <section className="w-full bg-[#FDFDFD] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-[900px] mx-auto">
        {/* Section Title */}
        <h2 className="text-center text-[28px] sm:text-[36px] md:text-[42px] leading-[100%] mb-8 md:mb-12">
          <span className="font-medium text-[#2E2E2E]">Key </span>
          <span className="font-bold text-[#2E2E2E]">Features</span>
        </h2>

        {/* 2-column accordion grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Left column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {leftCol.map((feature) => (
              <AccordionItem
                key={feature.id}
                feature={feature}
                isOpen={openId === feature.id}
                onToggle={() => toggle(feature.id)}
              />
            ))}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {rightCol.map((feature) => (
              <AccordionItem
                key={feature.id}
                feature={feature}
                isOpen={openId === feature.id}
                onToggle={() => toggle(feature.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
