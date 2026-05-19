"use client";

import Image from "next/image";
import { useState } from "react";
import type { Course } from "@/features/courses/types/course";
import EnquiryModal from "@/shared/components/EnquiryModal";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("http")) {
    try {
      const u = new URL(src);
      // Re-encode each path segment to handle spaces / special chars in filenames
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

export default function CourseHeroSection({ course }: { course: Course }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const imgSrc = resolveImage(course.heroImage);

  return (
    <>
      <section className="w-full bg-[#FDFDFD] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pb-14">
        {/* Hero Banner Image */}
        <div className="w-full max-w-[1200px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,184,198,0.25)] mt-[38px]">
          <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[358px] bg-[#00B8C6]/10 rounded-xl overflow-hidden group">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                priority
                unoptimized={imgSrc.startsWith("http://localhost")}
              />
            ) : (
              /* Fallback gradient banner when no image is set */
              <div className="w-full h-full bg-gradient-to-br from-[#00B8C6] to-[#008f9a] flex items-center justify-center">
                <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-[#00B8C6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
          </div>
        </div>

        {/* Text + CTA */}
        <div className="mt-8 md:mt-10 flex flex-col items-center gap-4 md:gap-5 max-w-[700px] w-full text-center">
          <h1 className="text-[20px] sm:text-[26px] md:text-[36px] lg:text-[44px] font-bold text-[#2E2E2E] leading-tight">
            {course.title}
          </h1>

          {course.description && (
            <p className="font-normal text-[13px] sm:text-[14px] md:text-[15px] text-[#2E2E2E]/70 leading-relaxed max-w-[560px] px-2">
              {course.description}
            </p>
          )}

          <button
            onClick={() => setEnquiryOpen(true)}
            className="mt-2 px-8 py-2.5 rounded-full text-white text-[15px] font-semibold bg-[#00B8C6] hover:bg-[#009aab] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(0,184,198,0.4)]"
          >
            Join Now!
          </button>
        </div>
      </section>

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} defaultCourseId={course.id} />
    </>
  );
}
