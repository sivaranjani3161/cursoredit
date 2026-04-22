"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const videos = [
  "/vid1.png",
  "/vid2.png",
  "/vid3.png",
  "/vid1.png",
  "/vid2.png",
];

// Card slot sizes per breakpoint (must match Tailwind classes below)
const CARD_HALF = { base: 130, sm: 170, md: 230 }; // half of 260 / 340 / 460

function getCardHalf(): number {
  // Only called inside useEffect — safe, no SSR involvement
  if (window.innerWidth >= 768) return CARD_HALF.md;
  if (window.innerWidth >= 640) return CARD_HALF.sm;
  return CARD_HALF.base;
}

export default function VideoTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Start at index 1 so the second card is centred on load
  const activeRef    = useRef(1);
  const scrollingRef = useRef(false);

  const [active, _setActive] = useState(1);

  // Padding is set via state, only after mount (avoids SSR/client mismatch)
  // SSR renders with 0 padding; after hydration useEffect sets correct value.
  const [padPx, setPadPx] = useState(0);

  const setActive = (i: number) => {
    activeRef.current = i;
    _setActive(i);
  };

  // ── Scroll card `index` to the visual centre ─────────────────────────────
  const scrollToCard = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el || scrollingRef.current) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const target = cards[index];
    if (!target) return;

    scrollingRef.current = true;
    const scrollTo =
      target.offsetLeft - el.offsetWidth / 2 + target.offsetWidth / 2;
    el.scrollTo({ left: scrollTo, behavior: "smooth" });
    setTimeout(() => { scrollingRef.current = false; }, 420);
  }, []);

  // ── After mount: set padding, snap to card 1, add resize handler ─────────
  useEffect(() => {
    const update = () => {
      const half = getCardHalf();
      setPadPx(half);

      // Re-snap to current active after padding change
      // Use rAF so the DOM has applied the new padding before we measure
      requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const cards = Array.from(el.children) as HTMLElement[];
        const target = cards[activeRef.current];
        if (!target) return;
        el.scrollLeft =
          target.offsetLeft - el.offsetWidth / 2 + target.offsetWidth / 2;
      });
    };

    update(); // initial
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Keep active + dots in sync with scroll position ──────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const viewCenter = el.scrollLeft + el.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(
          card.offsetLeft + card.offsetWidth / 2 - viewCenter
        );
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActive(closest);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handlePrev = () => {
    if (activeRef.current > 0) scrollToCard(activeRef.current - 1);
  };
  const handleNext = () => {
    if (activeRef.current < videos.length - 1)
      scrollToCard(activeRef.current + 1);
  };

  const canPrev = active > 0;
  const canNext = active < videos.length - 1;

  // padding value: 0 on server (SSR), correct px after client hydration
  // Using `calc(50% - Xpx)` centres card[0] and card[N-1] perfectly
  const sidePad = padPx > 0 ? `calc(50% - ${padPx}px)` : "0px";

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

      {/* Carousel wrapper — relative so buttons can be absolutely positioned */}
      <div className="relative mt-[30px] md:mt-[40px]">

        {/* LEFT BUTTON */}
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous"
          className={[
            "absolute left-3 sm:left-4 md:left-6",
            "top-1/2 -translate-y-1/2 z-20",
            "shrink-0 rounded-full flex items-center justify-center",
            "w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px]",
            "shadow-lg select-none transition-all duration-200",
            canPrev
              ? "bg-[#00B8C6] hover:bg-[#009DAA] cursor-pointer hover:scale-105 active:scale-95"
              : "bg-[#00B8C6]/30 cursor-default pointer-events-none",
          ].join(" ")}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8 1.5L2 8L8 14.5" stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next"
          className={[
            "absolute right-3 sm:right-4 md:right-6",
            "top-1/2 -translate-y-1/2 z-20",
            "shrink-0 rounded-full flex items-center justify-center",
            "w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px]",
            "shadow-lg select-none transition-all duration-200",
            canNext
              ? "bg-[#00B8C6] hover:bg-[#009DAA] cursor-pointer hover:scale-105 active:scale-95"
              : "bg-[#00B8C6]/30 cursor-default pointer-events-none",
          ].join(" ")}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M2 1.5L8 8L2 14.5" stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Scrollable strip */}
        <div
          ref={containerRef}
          className="
            flex items-center
            gap-[12px] sm:gap-[16px] md:gap-[20px]
            overflow-x-auto snap-x snap-mandatory scroll-smooth
          "
          style={{
            scrollbarWidth: "none",
            // sidePad is "0px" on SSR → no mismatch; correct after hydration
            paddingLeft:  sidePad,
            paddingRight: sidePad,
          }}
        >
          {videos.map((video, i) => {
            const isActive = i === active;
            return (
              // Outer: FIXED slot size — never changes → zero layout shift
              // Inner: CSS scale transform for zoom — doesn't affect layout
              <div
                key={i}
                onClick={() => scrollToCard(i)}
                className="
                  snap-center shrink-0 cursor-pointer
                  flex items-center justify-center
                  w-[260px] h-[158px]
                  sm:w-[340px] sm:h-[200px]
                  md:w-[460px] md:h-[260px]
                "
              >
                <div
                  className={[
                    "w-full h-full rounded-[12px] overflow-hidden origin-center",
                    "transition-all duration-300 ease-out",
                    isActive
                      ? "scale-100 opacity-100 shadow-xl"
                      : "scale-[0.88] opacity-55",
                  ].join(" ")}
                >
                  <div className="relative w-full h-full group">
                    <img
                      src={video}
                      alt={`Testimonial ${i + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
                    />
                    {/* Play icon */}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Dots — always in sync with active */}
      <div className="mt-[16px] md:mt-[20px] flex justify-center gap-[8px]">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={[
              "h-[6px] rounded-full transition-all duration-300 cursor-pointer",
              i === active
                ? "w-[24px] md:w-[28px] bg-[#00B8C6]"
                : "w-[6px] bg-gray-300 hover:bg-gray-400",
            ].join(" ")}
          />
        ))}
      </div>

    </section>
  );
}