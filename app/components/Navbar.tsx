"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import navData from "@/app/data/navbar.json";
import type { NavbarData } from "@/app/types/navbar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const data = navData as NavbarData;
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
const router = useRouter();
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
            {data.links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`
                  text-[13px] lg:text-[15px] font-medium whitespace-nowrap
                  px-[10px] lg:px-[12px] py-[5px] rounded-full border transition-colors
                  ${
                    pathname === link.href
                      ? "text-[#00B8C6] border-[#00B8C6]"
                      : "text-[#2E2E2E] border-transparent hover:text-[#00B8C6]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA — tablet + desktop */}
          <Link
            href={data.cta.href}
            className="
              hidden md:inline-flex shrink-0
              items-center justify-center
              bg-[#00B8C6] text-white
              px-[12px] lg:px-[22px]
              py-[7px] lg:py-[10px]
              rounded-full
              text-[13px] lg:text-[15px]
              font-medium whitespace-nowrap
            "
          >
            {data.cta.label}
          </Link>

          {/* HAMBURGER — mobile only */}
          <button
            className="md:hidden w-[36px] h-[36px] flex items-center justify-center shrink-0"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1L15 15M15 1L1 15" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path d="M0 1H22M0 8H22M0 15H22" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

        </div>
      </header>

      {/* MOBILE MENU — fixed overlay, never shifts page layout */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed top-[65px] inset-x-0 bottom-0 z-40 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer
              NO border-t, NO shadow-lg (those were causing the visible divider).
              Only a soft downward shadow so the drawer feels lifted over content.
          */}
          <div
            className="
              fixed top-[65px] left-0 right-0 z-40
              md:hidden
              bg-white
              px-5 pt-3 pb-6
              flex flex-col gap-[4px]
            "
          >
            {data.links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`
                  block text-[15px] font-medium py-[10px]
                  ${
                    pathname === link.href
                      ? "text-[#00B8C6]"
                      : "text-[#2E2E2E]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={data.cta.href}
              onClick={() => setOpen(false)}
              className="
                mt-[12px] block
                bg-[#00B8C6] text-white
                text-center py-[11px]
                rounded-full text-[14px] font-medium
              "
            >
              {data.cta.label}
            </Link>
          </div>
        </>
      )}
    </>
  );
}