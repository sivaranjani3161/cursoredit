"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { CourseCategory, CourseBasic } from "@/features/courses/types/course";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function resolveImage(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${BACKEND_URL}${path}`;
  return path;
}

function CourseCard({ course }: { course: CourseBasic }) {
  const [hovered, setHovered] = useState(false);
  const imgSrc = resolveImage(course.heroImage);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`overflow-hidden rounded-2xl border border-[#E6E6E6] transition-all duration-300 ${
          hovered ? "shadow-[0_12px_40px_rgba(0,184,198,0.18)] -translate-y-1" : "shadow-sm"
        }`}
      >
        {/* Image */}
        <div className="relative w-full h-[200px] sm:h-[220px] bg-[#00B8C6]/10 overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={imgSrc.startsWith("http://localhost")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#00B8C6]/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
          )}
          <div className={`absolute inset-0 bg-[#00B8C6]/15 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`} />
        </div>

        {/* Content */}
        <div className={`px-5 py-5 transition-colors duration-300 ${hovered ? "bg-[#00B8C6]" : "bg-white"}`}>
          <h2 className={`text-[18px] sm:text-[20px] font-semibold leading-snug mb-2 transition-colors duration-300 ${hovered ? "text-white" : "text-[#2E2E2E]"}`}>
            {course.title}
          </h2>
          {course.description && (
            <p className={`text-[13px] sm:text-[14px] leading-relaxed line-clamp-2 transition-colors duration-300 ${hovered ? "text-white/85" : "text-[#464646]"}`}>
              {course.description}
            </p>
          )}
          <div className={`mt-4 flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${hovered ? "text-white" : "text-[#00B8C6]"}`}>
            <span>View Course</span>
            <svg width="16" height="12" viewBox="0 0 20 14" fill="none">
              <path d="M2 7h12M10 3l6 4-6 4" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  categories: CourseCategory[];
}

export default function CoursesListingClient({ categories }: Props) {
  // Flatten all courses across all categories for the "All" tab
  const allCourses: CourseBasic[] = Array.from(
    new Map(categories.flatMap((c) => c.courses).map((c) => [c.id, c])).values()
  );

  // "all" is the default tab — each category tab is its id as a string
  const [activeTab, setActiveTab] = useState<"all" | number>("all");

  const visibleCourses =
    activeTab === "all"
      ? allCourses
      : categories.find((c) => c.id === activeTab)?.courses ?? [];

  // Empty state — no categories or no courses at all
  if (categories.length === 0 || allCourses.length === 0) {
    return (
      <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#00B8C6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#00B8C6]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2E2E2E] mb-2">No Courses Available</h1>
          <p className="text-[#464646]/70 text-sm">Check back soon — new courses are coming!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#00B8C6] to-[#008f9a] py-16 px-4 sm:px-6 lg:px-8 text-white text-center">
        <h1 className="text-[32px] sm:text-[42px] md:text-[52px] font-bold leading-tight mb-4">
          Our <span className="text-white/90 font-medium">Featured</span> Courses
        </h1>
        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
          Explore our career-boosting programs crafted by industry experts
        </p>
      </section>

      {/* Category Tabs — only rendered if there are 2+ categories */}
      <section className="sticky top-0 z-20 bg-white border-b border-[#E6E6E6] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
          {/* All tab */}
          <button
            onClick={() => setActiveTab("all")}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#00B8C6] text-white shadow-sm"
                : "bg-[#F4F4F4] text-[#464646] hover:bg-[#00B8C6]/10 hover:text-[#00B8C6]"
            }`}
          >
            All ({allCourses.length})
          </button>

          {/* One tab per category — only shown if it has courses */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === cat.id
                  ? "bg-[#00B8C6] text-white shadow-sm"
                  : "bg-[#F4F4F4] text-[#464646] hover:bg-[#00B8C6]/10 hover:text-[#00B8C6]"
              }`}
            >
              {cat.name} ({cat.courses.length})
            </button>
          ))}
        </div>
      </section>

      {/* Course Cards Grid */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {visibleCourses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#464646]/60 text-sm">No courses in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
