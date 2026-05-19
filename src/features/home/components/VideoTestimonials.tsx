"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ApiTestimonial } from "@/features/home/types/testimonial";
import { safeUrl } from "@/shared/lib/imageUtils";

interface VideoTestimonialsProps {
  items: ApiTestimonial[];
}

const CARD_HALF = { base: 130, sm: 170, md: 230 };

function getCardHalf(): number {
  if (window.innerWidth >= 768) return CARD_HALF.md;
  if (window.innerWidth >= 640) return CARD_HALF.sm;
  return CARD_HALF.base;
}

export default function VideoTestimonials({ items }: VideoTestimonialsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(1);
  const scrollingRef = useRef(false);

  const [active, _setActive] = useState(Math.min(1, Math.max(0, items.length - 1)));
  const [padPx, setPadPx] = useState(0);
  const [transitionReady, setTransitionReady] = useState(false);

  const setActive = (i: number) => {
    activeRef.current = i;
    _setActive(i);
  };

  const scrollToCard = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el || scrollingRef.current) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const target = cards[index];
    if (!target) return;
    scrollingRef.current = true;
    const scrollTo = target.offsetLeft - el.offsetWidth / 2 + target.offsetWidth / 2;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
    setTimeout(() => { scrollingRef.current = false; }, 420);
  }, []);

  useEffect(() => {
    const update = () => {
      const half = getCardHalf();
      setPadPx(half);
      requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const cards = Array.from(el.children) as HTMLElement[];
        const target = cards[activeRef.current];
        if (!target) return;
        el.scrollLeft = target.offsetLeft - el.offsetWidth / 2 + target.offsetWidth / 2;
      });
    };
    update();
    window.addEventListener("resize", update);
    const t = setTimeout(() => setTransitionReady(true), 50);
    return () => { window.removeEventListener("resize", update); clearTimeout(t); };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const viewCenter = el.scrollLeft + el.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - viewCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActive(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handlePrev = () => { if (activeRef.current > 0) scrollToCard(activeRef.current - 1); };
  const handleNext = () => { if (activeRef.current < items.length - 1) scrollToCard(activeRef.current + 1); };

  const canPrev = active > 0;
  const canNext = active < items.length - 1;
  const sidePad = padPx > 0 ? `calc(50% - ${padPx}px)` : "0px";

  // ── Empty state ──
  if (items.length === 0) {
    return (
      <section className="py-[50px] md:py-[80px] bg-[#FDFDFD]">
        <div className="text-center px-4">
          <h2 className="text-[24px] sm:text-[32px] md:text-[54px] text-[#2E2E2E]">
            Checkout our <span className="font-semibold">latest testimonials</span>
          </h2>
          <p className="mt-[10px] text-[14px] md:text-[16px] text-[#777] italic mt-[40px]">
            Video testimonials coming soon...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[50px] md:py-[80px] bg-[#FDFDFD]">

      {/* Heading */}
      <div className="text-center px-4">
        <h2 className="text-[24px] sm:text-[32px] md:text-[54px] text-[#2E2E2E]">
          Checkout our{" "}
          <span className="font-semibold">latest testimonials</span>
        </h2>
        <p className="mt-[10px] md:mt-[12px] text-[13px] sm:text-[14px] md:text-[16px] text-[#777]">
          Explore stories, tips, and guides from our tech community.
        </p>
      </div>

      <div className="relative mt-[30px] md:mt-[40px]">

        {/* LEFT BUTTON */}
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous"
          className={[
            "absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20",
            "shrink-0 rounded-full flex items-center justify-center",
            "w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px]",
            "shadow-lg select-none transition-all duration-200",
            canPrev
              ? "bg-[#00B8C6] hover:bg-[#009DAA] cursor-pointer hover:scale-105 active:scale-95"
              : "bg-[#00B8C6]/30 cursor-default pointer-events-none",
          ].join(" ")}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8 1.5L2 8L8 14.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next"
          className={[
            "absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20",
            "shrink-0 rounded-full flex items-center justify-center",
            "w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px]",
            "shadow-lg select-none transition-all duration-200",
            canNext
              ? "bg-[#00B8C6] hover:bg-[#009DAA] cursor-pointer hover:scale-105 active:scale-95"
              : "bg-[#00B8C6]/30 cursor-default pointer-events-none",
          ].join(" ")}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M2 1.5L8 8L2 14.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Scrollable strip */}
        <div
          ref={containerRef}
          className="flex items-center gap-[12px] sm:gap-[16px] md:gap-[20px] overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", paddingLeft: sidePad, paddingRight: sidePad }}
        >
          {items.map((item, i) => {
            const isActive = i === active;
            const hasThumbnail = Boolean(item.thumbnailUrl);
            const thumbnailSrc = safeUrl(item.thumbnailUrl);
            const hasVideo = Boolean(item.videoUrl);

            return (
              <div
                key={item.id}
                onClick={() => scrollToCard(i)}
                className="snap-center shrink-0 cursor-pointer flex items-center justify-center w-[260px] h-[158px] sm:w-[340px] sm:h-[200px] md:w-[460px] md:h-[260px]"
              >
                <div
                  className={[
                    "w-full h-full rounded-[12px] overflow-hidden origin-center",
                    transitionReady ? "transition-all duration-300 ease-out" : "",
                    isActive ? "scale-100 opacity-100 shadow-xl" : "scale-[0.88] opacity-55",
                  ].join(" ")}
                >
                  {/* Clickable video card */}
                  <a
                    href={hasVideo ? item.videoUrl! : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!hasVideo) e.preventDefault(); }}
                    className="relative w-full h-full group block"
                    style={{ textDecoration: "none" }}
                  >
                    {/* Thumbnail or gradient placeholder */}
                    {hasThumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailSrc!}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                        loading={isActive ? "eager" : "lazy"}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(135deg, #00B8C6 0%, #0097A7 60%, #006D77 100%)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "32px", opacity: 0.5 }}>🎬</span>
                        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 600, margin: 0 }}>
                          {item.name}
                        </p>
                        {item.role && (
                          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: 0 }}>
                            {item.role}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="
                        w-[38px] h-[38px] sm:w-[48px] sm:h-[48px] md:w-[60px] md:h-[60px]
                        bg-white/90 backdrop-blur-sm rounded-full shadow-md
                        flex items-center justify-center
                        transition-transform duration-200 group-hover:scale-110
                      ">
                        <div className="
                          w-0 h-0
                          border-l-[10px] sm:border-l-[12px] md:border-l-[14px]
                          border-l-[#00B8C6]
                          border-y-[6px] sm:border-y-[8px] md:border-y-[9px]
                          border-y-transparent
                          ml-[2px] sm:ml-[3px]
                        " />
                      </div>
                    </div>

                    {/* Name overlay on thumbnail */}
                    {hasThumbnail && (
                      <div
                        className="absolute bottom-0 left-0 right-0 px-3 py-2"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                      >
                        <p style={{ color: "#fff", fontSize: "12px", fontWeight: 600, margin: 0 }}>{item.name}</p>
                        {item.role && (
                          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "10px", margin: 0 }}>{item.role}</p>
                        )}
                      </div>
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Dots */}
      <div className="mt-[16px] md:mt-[20px] flex justify-center gap-[8px]">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={[
              "h-[6px] rounded-full transition-all duration-300 cursor-pointer",
              i === active ? "w-[24px] md:w-[28px] bg-[#00B8C6]" : "w-[6px] bg-gray-300 hover:bg-gray-400",
            ].join(" ")}
          />
        ))}
      </div>

    </section>
  );
}