"use client";

import { useState } from "react";
import Image from "next/image";
import offerData from "@/features/about/data/whatWeOffer.json";

function ServiceIcon({ name }: { name: string }) {
  const cls = "w-5 h-5 text-[#00B8C6]";
  switch (name) {
    case "graduation":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3.27L4 19m16-7.73L20 19" />
        </svg>
      );
    case "code":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        </svg>
      );
    case "certificate":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "training":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      );
    case "hiring":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.197-3.775M9 20H4v-2a4 4 0 015.197-3.775M15 10a3 3 0 11-6 0 3 3 0 016 0zM21 10a3 3 0 11-6 0M9 10a3 3 0 11-6 0" />
        </svg>
      );
    case "csr":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
  }
}

export default function WhatWeOffer() {
  const [activeTab, setActiveTab] = useState(offerData.tabs[0].id);
  const tab = offerData.tabs.find((t) => t.id === activeTab) ?? offerData.tabs[0];

  return (
    <section className="w-full bg-[#f8fffe] py-10 sm:py-14 lg:py-18 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
{/* Mobile-only heading */}
<h2 className="text-center text-[16px] font-extrabold text-[#1a1a1a] tracking-tight mb-4 sm:hidden">
  What We Offer
</h2>
      

  {/* ── Tab toggle ── */}
<div className="flex justify-center mb-8 sm:mb-12">
  <div className="flex bg-slate-100 rounded-full p-1 gap-1 w-full max-w-[320px] sm:max-w-fit">
    {offerData.tabs.map((t) => {
      const isActive = t.id === activeTab;
      return (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`
            flex-1 sm:flex-none
            px-3 sm:px-6 py-2 sm:py-2.5 rounded-full
            text-[10px] sm:text-[13px] font-semibold
            transition-all duration-200 text-center
            ${isActive
              ? "bg-[#00B8C6] text-white shadow-sm"
              : "bg-transparent text-slate-500 hover:text-[#00B8C6]"
            }
          `}
        >
          <span className="sm:hidden">
            {t.label.replace("What we offer For ", "For ")}
          </span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      );
    })}
  </div>
</div>
        {/* ── Content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* LEFT — image on mobile first, text below */}
          {/* Image */}
          <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[440px] rounded-2xl overflow-hidden order-first lg:order-last">
            <Image
              src={tab.image}
              alt={tab.heading}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-500"
              priority
            />
            {/* Teal accent bar bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00B8C6]" />
          </div>

          {/* Text + services */}
          <div className="flex flex-col order-last lg:order-first">

            {/* Tagline pill */}
            <span className="self-start text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-[#00B8C6] bg-[#00B8C6]/10 px-3 py-1 rounded-full mb-3">
              {tab.tagline}
            </span>

            {/* Heading */}
            <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-extrabold text-[#1a1a1a] leading-snug mb-3">
              {tab.heading}
            </h2>

            {/* Description */}
            <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-slate-500 leading-relaxed mb-6 sm:mb-8">
              {tab.description}
            </p>

            {/* Services — 2-col grid on sm+, 1-col on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {tab.services.map((svc, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-3 sm:p-4
                    hover:border-[#00B8C6]/30 hover:shadow-sm transition-all duration-200"
                >
                  {/* Icon circle */}
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00B8C6]/10 flex items-center justify-center border border-[#00B8C6]/20">
                    <ServiceIcon name={svc.icon} />
                  </div>
                  {/* Text */}
                  <div className="min-w-0">
                    <p className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a] mb-0.5 leading-snug">
                      {svc.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}