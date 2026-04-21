"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import navData from "@/app/data/navbar.json";
import type { NavbarData } from "@/app/types/navbar";
import { usePathname } from "next/navigation";
const data = navData as NavbarData;

export default function Navbar() {
  const [open, setOpen] = useState(false);
const pathname = usePathname();
  return (
    <header className="w-full bg-white mb-[8px] md:mb-[10px] mt-[8px] md:mt-[10px] sticky top-0 z-50">

      <div className="max-w-[1100px] lg:max-w-[1200px] mx-auto flex items-center justify-between px-4 py-[12px] md:py-[14px]">

<Image
  src="/logo.png"
  alt="logo"
  width={0}
  height={0}
  sizes="(max-width: 768px) 140px, 180px"
  priority
  onClick={() => window.location.reload()}
  className="
    w-[140px] h-auto
    md:w-[180px] md:h-auto
    cursor-pointer
  "
/>

        {/* DESKTOP NAV */}
     {/* DESKTOP + TABLET NAV */}
{/* NAV */}
<nav className="
  hidden md:flex items-center
  gap-[10px] lg:gap-[24px]
  flex-1 justify-center
">

  {data.links.map((link, index) => (
    <Link
      key={index}
      href={link.href}
      className={`
        text-[13px] lg:text-[16px]
        font-medium transition whitespace-nowrap

        ${
          pathname === link.href
            ? "text-[#00B8C6] border border-[#00B8C6] px-[8px] lg:px-[14px] py-[3px] lg:py-[5px] rounded-full"
            : "text-[#2E2E2E] hover:text-[#00B8C6]"
        }
      `}
    >
      {link.label}
    </Link>
  ))}

</nav>

{/* CTA (ONLY LARGE SCREENS) */}
<Link
  href={data.cta.href}
  className="
    hidden md:inline-flex
    items-center justify-center

    bg-[#00B8C6] text-white

    px-[18px]
    py-[8px]

    rounded-full
    text-[15px]
    font-medium
  "
>
  {data.cta.label}
</Link>



    

        {/* MOBILE MENU BUTTON */}
       <button
  className="md:hidden p-1"
  onClick={() => setOpen(!open)}
>
  {open ? (
    <span className="text-[24px] font-bold text-[#2E2E2E]">✕</span>
  ) : (
    <div className="flex flex-col gap-[4px]">
      <span className="w-6 h-[2px] bg-[#2E2E2E]" />
      <span className="w-6 h-[2px] bg-[#2E2E2E]" />
      <span className="w-6 h-[2px] bg-[#2E2E2E]" />
    </div>
  )}
</button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 pb-5 pt-3 space-y-[12px] bg-white border-t border-[#EAEAEA] shadow-sm">

          {data.links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`
                block text-[15px] font-medium py-[6px]
                ${
pathname === link.href                    ? "text-[#00B8C6]"
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
            className="block bg-[#00B8C6] text-white text-center py-[10px] rounded-full text-[14px] font-medium mt-[8px]"
          >
            {data.cta.label}
          </Link>

        </div>
      )}

    </header>
  );
}