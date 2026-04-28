"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import navData from "@/app/data/navbar.json";
import type { NavbarData } from "@/app/types/navbar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import EnquiryModal from "@/app/components/Enquirymodel"; 

const data = navData as NavbarData;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false); // ← NEW
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setOpen(false);
    setMobileExpandedIndex(null);
  }, [pathname]);

  return (
    <>
      <header className="w-full bg-white sticky top-0 z-50">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-8 flex items-center justify-between h-[65px]">

          <Image
            src="/logo.png"
            alt="logo"
            width={180}
            height={60}
            sizes="(max-width: 768px) 140px, (max-width: 1024px) 120px, 180px"
            priority
            onClick={() => router.push("/")}
            style={{ height: "auto" }}
            className="w-[120px] md:w-[150px] lg:w-[180px] cursor-pointer shrink-0"
          />

          {/* DESKTOP + TABLET NAV */}
          <nav className="hidden md:flex items-center gap-[6px] lg:gap-[20px] mx-2 lg:mx-8 flex-1 justify-center">
            {data.links.map((link, index) => {
              const hasDropdown = !!(link as any).dropdown;

              if (hasDropdown) {
                const isCoursesActive = pathname.startsWith("/courses");
                return (
                  <div key={index} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className={`
                        flex items-center gap-[4px]
                        text-[13px] lg:text-[15px] font-medium whitespace-nowrap
                        px-[10px] lg:px-[12px] py-[5px] rounded-full border transition-colors
                        ${isCoursesActive
                          ? "text-[#00B8C6] border-[#00B8C6]"
                          : "text-[#2E2E2E] border-transparent hover:text-[#00B8C6]"
                        }
                      `}
                    >
                      {link.label}
                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="
                        absolute top-[calc(100%+8px)] left-0
                        bg-white rounded-[10px]
                        shadow-[0_8px_32px_rgba(0,0,0,0.13)]
                        min-w-[220px] py-[8px] z-50
                        border border-gray-100
                        pointer-events-auto
                      ">
                        {(link as any).dropdown.map((item: any, i: number) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={i}
                              href={item.href}
                              onClick={() => setDropdownOpen(false)}
                              className={`
                                flex items-center justify-between
                                px-[18px] py-[10px] text-[14px] font-medium
                                transition-colors group cursor-pointer
                                ${isActive
                                  ? "bg-[#00B8C6]/10 text-[#00B8C6]"
                                  : "text-[#2E2E2E] hover:bg-[#00B8C6]/10 hover:text-[#00B8C6]"
                                }
                              `}
                            >
                              <span>{item.label}</span>
                              {item.hasArrow && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                  className="opacity-50 group-hover:opacity-100 transition-opacity">
                                  <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`
                    text-[13px] lg:text-[15px] font-medium whitespace-nowrap
                    px-[10px] lg:px-[12px] py-[5px] rounded-full border transition-colors
                    ${pathname === link.href
                      ? "text-[#00B8C6] border-[#00B8C6]"
                      : "text-[#2E2E2E] border-transparent hover:text-[#00B8C6]"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA — now opens modal instead of navigating */}
          <button
            onClick={() => setEnquiryOpen(true)}
            className="
              hidden md:inline-flex shrink-0 items-center justify-center
              bg-[#00B8C6] text-white
              px-[12px] lg:px-[22px] py-[7px] lg:py-[10px]
              rounded-full text-[13px] lg:text-[15px] font-medium whitespace-nowrap
              hover:opacity-90 active:scale-[0.97] transition
            "
          >
            {data.cta.label}
          </button>

          {/* HAMBURGER */}
          <button
            className="md:hidden w-[36px] h-[36px] flex items-center justify-center shrink-0"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1L15 15M15 1L1 15" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path d="M0 1H22M0 8H22M0 15H22" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <>
          <div
            className="fixed top-[65px] inset-x-0 bottom-0 z-40 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="
            fixed top-[65px] left-0 right-0 z-40 md:hidden
            bg-white px-5 pt-3 pb-6 flex flex-col gap-[4px]
          ">
            {data.links.map((link, index) => {
              const hasDropdown = !!(link as any).dropdown;

              if (hasDropdown) {
                const isExpanded = mobileExpandedIndex === index;
                const isCoursesActive = pathname.startsWith("/courses");
                return (
                  <div key={index}>
                    <button
                      onClick={() => setMobileExpandedIndex(isExpanded ? null : index)}
                      className={`
                        w-full flex items-center justify-between
                        text-[15px] font-medium py-[10px]
                        ${isCoursesActive ? "text-[#00B8C6]" : "text-[#2E2E2E]"}
                      `}
                    >
                      <span>{link.label}</span>
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none"
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="pl-[16px] flex flex-col gap-[2px] pb-[6px]">
                        {(link as any).dropdown.map((item: any, i: number) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={i}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={`
                                flex items-center justify-between
                                text-[14px] font-medium py-[8px]
                                border-l-2 pl-[12px]
                                ${isActive
                                  ? "text-[#00B8C6] border-[#00B8C6]"
                                  : "text-[#555] border-transparent hover:text-[#00B8C6] hover:border-[#00B8C6]"
                                }
                              `}
                            >
                              <span>{item.label}</span>
                              {item.hasArrow && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    block text-[15px] font-medium py-[10px]
                    ${pathname === link.href ? "text-[#00B8C6]" : "text-[#2E2E2E]"}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile CTA — opens modal */}
            <button
              onClick={() => {
                setOpen(false);
                setEnquiryOpen(true);
              }}
              className="
                mt-[12px] block bg-[#00B8C6] text-white
                text-center py-[11px] rounded-full text-[14px] font-medium
                hover:opacity-90 active:scale-[0.97] transition w-full
              "
            >
              {data.cta.label}
            </button>
          </div>
        </>
      )}

      {/* ENQUIRY MODAL */}
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}