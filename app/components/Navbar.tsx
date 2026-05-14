"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import navData from "@/app/data/navbar.json";
import type { NavbarData } from "@/app/types/navbar";
import { usePathname, useRouter } from "next/navigation";
import EnquiryModal from "@/app/components/Enquirymodel";

const data = navData as NavbarData;
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface CourseBasic { id: number; title: string; slug: string; }
interface CategoryWithCourses { id: number; name: string; slug: string; courses: CourseBasic[]; }

export default function Navbar() {
  const [open, setOpen]                         = useState(false);
  const [dropdownOpen, setDropdownOpen]         = useState(false);
  const [activeCatId, setActiveCatId]           = useState<number | null>(null);
  const [mobileNavExpanded, setMobileNavExpanded] = useState<number | null>(null);
  const [mobileCatExpanded, setMobileCatExpanded] = useState<number | null>(null);
  const [enquiryOpen, setEnquiryOpen]           = useState(false);
  const [categories, setCategories]             = useState<CategoryWithCourses[]>([]);
  const pathname  = usePathname();
  const router    = useRouter();
  const wrapRef   = useRef<HTMLDivElement>(null);
  const closeTimer= useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/course-categories/with-courses`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : [])
      .then((d: CategoryWithCourses[]) => Array.isArray(d) && setCategories(d))
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false); setActiveCatId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setDropdownOpen(false); setOpen(false);
    setMobileNavExpanded(null); setMobileCatExpanded(null); setActiveCatId(null);
  }, [pathname]);

  const startCloseTimer = () => {
    closeTimer.current = setTimeout(() => { setDropdownOpen(false); setActiveCatId(null); }, 150);
  };
  const cancelCloseTimer = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };



  return (
    <>
      <header className="w-full bg-white sticky top-0 z-50 shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[65px]">

          {/* Logo */}
          <Image src="/logo.png" alt="logo" width={180} height={60}
            sizes="(max-width: 640px) 110px, (max-width: 1024px) 150px, 180px"
            priority onClick={() => router.push("/")}
            style={{ height: "auto" }}
            className="w-[110px] sm:w-[140px] lg:w-[180px] cursor-pointer shrink-0"
          />

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden md:flex items-center gap-[6px] lg:gap-[18px] mx-2 lg:mx-6 flex-1 justify-center">
            {data.links.map((link, idx) => {
              const hasDropdown = !!(link as any).dropdown;
              if (!hasDropdown) {
                return (
                  <Link key={idx} href={link.href}
                    className={`text-[13px] lg:text-[15px] font-medium whitespace-nowrap px-[10px] lg:px-[12px] py-[5px] rounded-full border transition-colors ${
                      pathname === link.href
                        ? "text-[#00B8C6] border-[#00B8C6]"
                        : "text-[#2E2E2E] border-transparent hover:text-[#00B8C6]"
                    }`}
                  >{link.label}</Link>
                );
              }

              const isCoursesActive = pathname.startsWith("/courses");
              return (
                <div key={idx} className="relative" ref={wrapRef}
                  onMouseLeave={startCloseTimer} onMouseEnter={cancelCloseTimer}
                >
                  {/* Trigger button */}
                  <button
                    onClick={() => { setDropdownOpen(p => !p); setActiveCatId(null); }}
                    onMouseEnter={() => { cancelCloseTimer(); setDropdownOpen(true); }}
                    className={`flex items-center gap-1 text-[13px] lg:text-[15px] font-medium whitespace-nowrap px-[10px] lg:px-[12px] py-[5px] rounded-full border transition-colors ${
                      isCoursesActive ? "text-[#00B8C6] border-[#00B8C6]" : "text-[#2E2E2E] border-transparent hover:text-[#00B8C6]"
                    }`}
                  >
                    {link.label}
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                      className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* ── Main dropdown ── */}
                  {dropdownOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 bg-white rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.14)] border border-gray-100 z-50 min-w-[220px] py-1 overflow-visible">

                      {/* All Courses */}
                      <Link href="/courses"
                        onClick={() => { setDropdownOpen(false); setActiveCatId(null); }}
                        className={`flex items-center px-4 py-[9px] text-[13.5px] font-bold border-b border-gray-100 mb-1 transition-colors ${
                          pathname === "/courses" ? "text-[#00B8C6] bg-[#00B8C6]/8" : "text-[#00B8C6] hover:bg-[#00B8C6]/8"
                        }`}
                      >
                        All Courses
                      </Link>

                      {/* Category rows — each has a ▶ submenu */}
                      {categories.map((cat) => (
                        <div key={cat.id} className="relative group/cat"
                          onMouseEnter={() => { cancelCloseTimer(); setActiveCatId(cat.id); }}
                          onMouseLeave={() => { /* let parent wrapper handle */ }}
                        >
                          <button
                            className={`w-full flex items-center justify-between px-4 py-[9px] text-[13px] font-medium transition-colors text-left ${
                              activeCatId === cat.id ? "bg-[#00B8C6] text-white" : "text-[#2E2E2E] hover:bg-[#00B8C6] hover:text-white"
                            }`}
                          >
                            <span className="truncate pr-2">{cat.name}</span>
                            {/* ▶ arrow */}
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
                              <path d="M3 1.5L7 5L3 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* ── Sub-menu (to the RIGHT) ── */}
                          {activeCatId === cat.id && (
                            <div
                              className="absolute left-full top-0 bg-white rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.14)] border border-gray-100 z-50 min-w-[220px] py-1"
                              style={{ marginLeft: 4 }}
                              onMouseEnter={() => { cancelCloseTimer(); setActiveCatId(cat.id); }}
                            >
                              {cat.courses.length === 0 ? (
                                <p className="px-4 py-3 text-[12px] text-slate-400 italic">No courses in this category</p>
                              ) : cat.courses.map((course) => {
                                const href = `/courses/${course.slug}`;
                                const isActive = pathname === href;
                                return (
                                  <Link key={course.id} href={href}
                                    onClick={() => { setDropdownOpen(false); setActiveCatId(null); }}
                                    className={`flex items-center justify-between px-4 py-[9px] text-[13px] font-medium transition-colors group/link ${
                                      isActive ? "bg-[#00B8C6]/10 text-[#00B8C6]" : "text-[#2E2E2E] hover:bg-[#00B8C6] hover:text-white"
                                    }`}
                                  >
                                    <span>{course.title}</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50 group-hover/link:opacity-100 flex-shrink-0 ml-2">
                                      <path d="M2.5 6h7M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA */}
          <button onClick={() => setEnquiryOpen(true)}
            className="hidden md:inline-flex shrink-0 items-center justify-center bg-[#00B8C6] text-white px-[12px] lg:px-[22px] py-[7px] lg:py-[10px] rounded-full text-[13px] lg:text-[15px] font-medium whitespace-nowrap hover:opacity-90 active:scale-[0.97] transition"
          >{data.cta.label}</button>

          {/* Hamburger */}
          <button className="md:hidden w-[36px] h-[36px] flex items-center justify-center shrink-0"
            onClick={() => setOpen(p => !p)} aria-label="Toggle menu">
            {open
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1L15 15M15 1L1 15" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round"/></svg>
              : <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M0 1H22M0 8H22M0 15H22" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round"/></svg>
            }
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {open && (
        <>
          <div className="fixed top-[65px] inset-x-0 bottom-0 z-40 bg-black/20 md:hidden" onClick={() => setOpen(false)}/>
          <div className="fixed top-[65px] left-0 right-0 z-40 md:hidden bg-white px-5 pt-3 pb-6 flex flex-col gap-[2px] max-h-[calc(100dvh-65px)] overflow-y-auto shadow-xl">
            {data.links.map((link, idx) => {
              const hasDropdown = !!(link as any).dropdown;
              if (!hasDropdown) {
                return (
                  <Link key={idx} href={link.href} onClick={() => setOpen(false)}
                    className={`block text-[15px] font-medium py-[10px] border-b border-slate-50 ${pathname === link.href ? "text-[#00B8C6]" : "text-[#2E2E2E]"}`}
                  >{link.label}</Link>
                );
              }

              const isExpanded = mobileNavExpanded === idx;
              const isCoursesActive = pathname.startsWith("/courses");
              return (
                <div key={idx} className="border-b border-slate-50">
                  <button
                    onClick={() => setMobileNavExpanded(isExpanded ? null : idx)}
                    className={`w-full flex items-center justify-between text-[15px] font-medium py-[10px] ${isCoursesActive ? "text-[#00B8C6]" : "text-[#2E2E2E]"}`}
                  >
                    <span>{link.label}</span>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none"
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="pb-3 pl-2 flex flex-col gap-0.5">
                      {/* All Courses */}
                      <Link href="/courses" onClick={() => setOpen(false)}
                        className={`flex items-center py-2 pl-3 pr-2 text-[14px] font-bold rounded-lg mb-1 ${
                          pathname === "/courses" ? "text-[#00B8C6] bg-[#00B8C6]/8" : "text-[#00B8C6] hover:bg-[#00B8C6]/8"
                        }`}
                      >All Courses</Link>

                      {categories.map((cat) => {
                        const catExpanded = mobileCatExpanded === cat.id;
                        return (
                          <div key={cat.id} className="rounded-lg overflow-hidden">
                            <button
                              onClick={() => setMobileCatExpanded(catExpanded ? null : cat.id)}
                              className={`w-full flex items-center justify-between py-2 pl-3 pr-2 text-[13px] font-semibold transition-colors rounded-lg ${
                                catExpanded ? "bg-[#00B8C6] text-white" : "text-[#2E2E2E] hover:bg-slate-100"
                              }`}
                            >
                              <span className="text-left leading-snug">{cat.name}</span>
                              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                                {cat.courses.length > 0 && (
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${catExpanded ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                                    {cat.courses.length}
                                  </span>
                                )}
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                  className={`transition-transform duration-200 ${catExpanded ? "rotate-90" : ""}`}>
                                  <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </button>

                            {catExpanded && (
                              <div className="bg-slate-50 rounded-b-lg mt-0.5">
                                {cat.courses.length === 0 ? (
                                  <p className="text-[12px] text-slate-400 italic py-2 pl-4">No courses yet</p>
                                ) : cat.courses.map((course) => {
                                  const href = `/courses/${course.slug}`;
                                  return (
                                    <Link key={course.id} href={href} onClick={() => setOpen(false)}
                                      className={`flex items-center py-2 pl-4 pr-3 text-[13px] font-medium transition-colors ${
                                        pathname === href ? "text-[#00B8C6]" : "text-[#555] hover:text-[#00B8C6]"
                                      }`}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#00B8C6]/40 flex-shrink-0 mr-2"/>
                                      {course.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <button onClick={() => { setOpen(false); setEnquiryOpen(true); }}
              className="mt-3 bg-[#00B8C6] text-white text-center py-[11px] rounded-full text-[14px] font-medium hover:opacity-90 active:scale-[0.97] transition w-full"
            >{data.cta.label}</button>
          </div>
        </>
      )}

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}