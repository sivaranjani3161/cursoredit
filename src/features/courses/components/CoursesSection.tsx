"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import type { CourseBasic } from "@/features/courses/types/course";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads/")) return `${BACKEND}${src}`;
  return src;
}

// Static fallback course cards shown when backend is unavailable
const FALLBACK_COURSES: CourseBasic[] = [
  { id: 1, title: "Full Stack Web Development", description: "Master front-end and back-end development.", heroImage: "/course1.png", slug: "full-stack-development" },
  { id: 2, title: "Testing Automation – CI & CD", description: "Master Testing Automation in just 2 months.", heroImage: "/course2.png", slug: "qa-automation" },
  { id: 3, title: "Cloud Computing & DevOps Engineering", description: "Master Cloud Computing & DevOps in 5 months.", heroImage: "/course3.png", slug: "dev-ops-mastery" },
];

function CourseCardItem({ course, active }: { course: CourseBasic; active: boolean }) {
  const [hover, setHover] = useState(false);
  const imgSrc = resolveImage(course.heroImage);
  const isHighlighted = hover;

  // Badge tag derived from title (first word is category fallback)
  const tag = course.title.split(" ")[0];

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={`block overflow-hidden w-[260px] sm:w-[300px] md:w-[384px] shrink-0 transition-all duration-300 ease-out ${hover ? "-translate-y-[8px]" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* IMAGE */}
      <div className="relative w-full h-[170px] sm:h-[240px] md:h-[282px] rounded-t-[12px] overflow-hidden bg-[#00B8C6]/10">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 384px"
            className="object-cover transition-transform duration-500"
            unoptimized={imgSrc.startsWith("http://localhost")}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#00B8C6]/30 to-[#00B8C6]/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#00B8C6]/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        )}
        {/* TAG */}
        <div className="absolute top-[12px] left-0 z-10">
          <span className="bg-white text-[#2E2E2E] text-[11px] px-[12px] py-[4px] rounded-r-full border-b-[3px] border-[#00B8C6] shadow-sm">
            {tag}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className={`w-full min-h-[180px] md:min-h-[200px] border border-[#E6E6E6] border-t-0 rounded-b-[12px] px-[16px] py-[18px] flex flex-col justify-between transition-all duration-300 ${isHighlighted ? "bg-[#00B8C6]" : "bg-white"}`}>
        <div className="flex flex-col gap-[6px]">
          <h3 className={`text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-snug transition-colors duration-300 ${isHighlighted ? "text-white" : "text-[#2E2E2E]"}`}>
            {course.title}
          </h3>
          {course.description && (
            <p className={`text-[12px] sm:text-[13px] md:text-[14px] line-clamp-2 transition-colors duration-300 ${isHighlighted ? "text-white/90" : "text-[#464646]"}`}>
              {course.description}
            </p>
          )}
        </div>

        {/* Enquire button */}
        <div className="flex items-center gap-2 mt-[10px]">
          <button className={`flex-1 h-[38px] flex items-center justify-between px-[14px] rounded-full text-[12px] font-semibold transition-all duration-300 ${isHighlighted ? "bg-white text-[#2E2E2E] border border-[#BABABA]" : "bg-[#00B8C6] text-white border border-transparent"}`}>
            <span>View Course</span>
            <svg width="18" height="12" viewBox="0 0 28 18" fill="none">
              <path d="M2 9h18M16 5l6 4-6 4" strokeWidth="2" stroke="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function CoursesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [courses, setCourses] = useState<CourseBasic[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/courses/active`, { cache: "no-store" });
        if (res.ok) {
          const data: CourseBasic[] = await res.json();
          setCourses(data.length > 0 ? data : FALLBACK_COURSES);
        } else {
          setCourses(FALLBACK_COURSES);
        }
      } catch {
        setCourses(FALLBACK_COURSES);
      } finally {
        setLoaded(true);
      }
    };
    fetchCourses();
  }, []);

  // Scroll centering
  useEffect(() => {
    if (!loaded) return;
    const el = containerRef.current;
    if (!el) return;

    const cards = Array.from(el.children) as HTMLElement[];
    requestAnimationFrame(() => {
      if (cards.length > 1) {
        const target = cards[Math.floor(cards.length / 2)];
        const offset = target.offsetLeft - (el.offsetWidth / 2 - target.offsetWidth / 2);
        el.scrollTo({ left: offset, behavior: "auto" });
      }
    });

    const handleScroll = () => {
      const center = el.scrollLeft + el.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActive(closest);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loaded, courses]);

  const scroll = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.offsetWidth * 0.8 : el.offsetWidth * 0.8, behavior: "smooth" });
  };

  // Duplicate for infinite-ish scrolling (3+ items)
  const displayCourses = courses.length > 0 ? (courses.length >= 3 ? [...courses, ...courses] : courses) : [];

  return (
    <section className="bg-[#FDFDFD] py-[40px] md:py-[80px] px-4">
      {/* TITLE */}
      <div className="text-center mb-[30px] md:mb-[40px]">
        <h2 className="text-[24px] sm:text-[28px] md:text-[54px] text-[#2E2E2E]">
          Our Featured <span className="font-bold">Courses</span>
        </h2>
        <p className="mt-[10px] text-[13px] sm:text-[14px] md:text-[16px] text-[#464646]">
          Explore our most popular, career-boosting courses
        </p>
      </div>

      {!loaded ? (
        /* Loading skeleton */
        <div className="flex justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[260px] sm:w-[300px] md:w-[340px] shrink-0 animate-pulse">
              <div className="h-[200px] rounded-t-[12px] bg-slate-200" />
              <div className="h-[140px] rounded-b-[12px] bg-slate-100 p-4">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-full mb-1" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SLIDER */
        <div className="mt-[30px] md:mt-[50px] flex justify-center">
          <div className="relative w-full max-w-[1200px]">
            {/* LEFT */}
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex absolute left-0 md:left-[-25px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-[#00B8C6] text-white rounded-full items-center justify-center hover:bg-[#009aab] transition"
            >
              <IoIosArrowBack size={20} />
            </button>

            {/* RIGHT */}
            <button
              onClick={() => scroll("right")}
              className="hidden sm:flex absolute right-0 md:right-[-25px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-[#00B8C6] text-white rounded-full items-center justify-center hover:bg-[#009aab] transition"
            >
              <IoIosArrowForward size={20} />
            </button>

            <div className="overflow-hidden">
              <div
                ref={containerRef}
                className="flex gap-[12px] sm:gap-[16px] md:gap-[24px] overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide pl-4 pr-4"
              >
                {displayCourses.map((course, i) => (
                  <div
                    key={`${course.id}-${i}`}
                    className={`snap-center shrink-0 transition-all duration-300 ${i === active ? "scale-100" : "scale-[0.92] opacity-80"}`}
                  >
                    <CourseCardItem course={course} active={i === active} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}