"use client";

import { useState } from "react";
import type { Course, CourseHighlight } from "@/app/types/course";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("http")) {
    try {
      const u = new URL(src);
      u.pathname = u.pathname
        .split("/")
        .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
        .join("/");
      return u.toString();
    } catch {
      return src;
    }
  }
  if (src.startsWith("/uploads/")) return `${BACKEND}${src}`;
  return src;
}

/** Icon rendered as <img> so we can handle uploaded SVGs / PNGs / any format */
function FeatureIcon({ icon, alt, size = 32 }: { icon: string | null; alt: string; size?: number }) {
  const src = resolveImage(icon);
  if (!src) {
    return (
      <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={size} height={size} className="object-contain brightness-0 invert" style={{ width: size, height: size }} />
  );
}

function FeatureCard({ feature, active = false }: { feature: CourseHighlight; active?: boolean }) {
  return (
    <div className="bg-white rounded-[12px] flex flex-col items-center text-center px-6 py-8 flex-1 min-h-[280px] sm:min-h-[310px] lg:min-h-[333px] shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 ease-out cursor-default group">
      <div className="w-[56px] h-[56px] rounded-lg bg-[#00B8C6] flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        <FeatureIcon icon={feature.icon} alt={feature.title} />
      </div>
      <h3 className="font-semibold text-[#2E2E2E] leading-[120%] tracking-normal mb-3 text-[18px] sm:text-[20px] md:text-[18px] lg:text-[22px] group-hover:text-[#00B8C6] transition-colors duration-300">
        {feature.title}
      </h3>
      {feature.description && feature.description.length > 0 && (
        <ul className="text-[#2E2E2E]/70 text-[13px] leading-relaxed font-normal group-hover:text-[#2E2E2E]/90 transition-colors duration-300 space-y-1 text-left w-full">
          {feature.description.map((point, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00B8C6] flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-5 w-0 group-hover:w-[40px] h-[2px] bg-[#00B8C6] rounded-full transition-all duration-500 ease-out" />
    </div>
  );
}

export default function CourseFeaturesSection({ course }: { course: Course }) {
  const highlights = course.courseHighlights ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (highlights.length === 0) return null;

  const activeFeature = highlights[activeIndex] ?? highlights[0];

  return (
    <section className="w-full bg-[#00B8C6] py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* ── MOBILE LAYOUT ── */}
      <div className="sm:hidden flex flex-col items-center gap-6">
        {/* Icon selector row */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {highlights.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveIndex(index)}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeIndex === index ? "scale-125" : "scale-100"}`}
            >
              <div className={`w-[56px] h-[56px] rounded-xl bg-[#00B8C6] flex items-center justify-center transition-all duration-300 ${activeIndex === index ? "border-[3px] border-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]" : "border-[3px] border-transparent"}`}>
                <FeatureIcon icon={feature.icon} alt={feature.title} />
              </div>
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-white" : "bg-white/40"}`} />
            </button>
          ))}
        </div>

        {/* Active feature card */}
        <div className="bg-white rounded-[12px] px-6 py-8 w-full min-h-[220px] flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="w-[56px] h-[56px] rounded-lg bg-[#00B8C6] flex items-center justify-center mb-4 flex-shrink-0">
            <FeatureIcon icon={activeFeature.icon} alt={activeFeature.title} />
          </div>
          <h3 className="font-semibold text-[#2E2E2E] text-[18px] leading-[130%] mb-2">
            {activeFeature.title}
          </h3>
          {activeFeature.description && activeFeature.description.length > 0 && (
            <ul className="text-[#2E2E2E]/70 text-[12px] leading-relaxed space-y-1 text-left w-full">
              {activeFeature.description.map((point, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00B8C6] flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 w-[40px] h-[2px] bg-[#00B8C6] rounded-full" />
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {highlights.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 ${activeIndex === i ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {/* ── TAB & DESKTOP LAYOUT ── */}
      <div className="hidden sm:flex max-w-[1200px] mx-auto flex-row items-stretch justify-center gap-6 md:gap-8">
        {highlights.map((feature, index) => (
          <div
            key={feature.id}
            style={{ animation: `fadeSlideUp 0.6s ease forwards`, animationDelay: `${index * 150}ms` }}
            className="flex-1"
          >
            <FeatureCard feature={feature} />
          </div>
        ))}
      </div>
    </section>
  );
}
