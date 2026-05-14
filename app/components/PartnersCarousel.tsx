"use client";

import Image from "next/image";
import { useEffect } from "react";
import partnersData from "@/app/data/partners.json";

function PlaceholderLogo({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 px-2">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00B8C6]/10 border border-[#00B8C6]/25 flex items-center justify-center">
        <span className="text-[10px] sm:text-[12px] font-bold text-[#00B8C6]">{initials}</span>
      </div>
      <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 text-center leading-tight line-clamp-2 max-w-[90px]">
        {name}
      </p>
    </div>
  );
}

export default function PartnersCarousel() {
  const { heading, description, partners } = partnersData;
  const track = [...partners, ...partners];

  useEffect(() => {
    const styleId = "partners-scroll-keyframes";
    if (!document.getElementById(styleId)) {
      const el = document.createElement("style");
      el.id = styleId;
      el.textContent = [
        "@keyframes partners-scroll {",
        "  from { transform: translateX(0); }",
        "  to { transform: translateX(-50%); }",
        "}",
      ].join(" ");
      document.head.appendChild(el);
    }
  }, []);

  return (
    <section className="w-full bg-white py-6 sm:py-8 overflow-hidden border-t border-slate-100">

      {/* Heading */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center mb-5 sm:mb-6">
      <h2 className="font-urbanist text-[13px] sm:text-[15px] lg:text-[17px] font-extrabold tracking-[0.13em] text-[#00B8C6] uppercase mb-2">
  {heading}
</h2>
        <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-slate-500 max-w-[420px] mx-auto leading-relaxed">
          {description}
        </p>
        <div className="mx-auto mt-3 w-8 h-[2px] rounded-full bg-[#00B8C6]" />
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div
          className="flex gap-2 sm:gap-3"
          style={{
            width: "max-content",
            animation: "partners-scroll 70s linear infinite",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")
          }
        >
          {track.map((partner, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[120px] h-[85px] sm:w-[155px] sm:h-[105px] lg:w-[180px] lg:h-[115px] bg-white border border-slate-200 rounded-xl hover:border-[#00B8C6]/40 hover:shadow-sm transition-all duration-300 overflow-hidden"
            >
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={180}
                  height={115}
                  className="w-full h-full object-contain p-2 sm:p-3"
                />
              ) : (
                <PlaceholderLogo name={partner.name} />
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}