"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import blogsData from "@/app/data/blogs.json";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineArrowRightAlt } from "react-icons/md";

export default function BlogSection() {
  const blogs = blogsData.blogs;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, blogs.length - 1));
    const container = scrollRef.current;
    if (!container) return;
    setActiveIndex(clamped);
    container.scrollTo({
      left: clamped * container.offsetWidth,
      behavior: "smooth",
    });
  };

  const prev = () => scrollToIndex(activeIndex - 1);
  const next = () => scrollToIndex(activeIndex + 1);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.offsetWidth);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-[#FDFDFD] py-[60px] md:py-[80px] text-center overflow-hidden px-4">

      {/* TITLE */}
      <h2 className="text-[26px] sm:text-[32px] md:text-[54px] text-[#2E2E2E]">
        Our <span className="font-bold">Awesome Blog</span>
      </h2>

      <p className="mt-[10px] md:mt-[12px] text-[13px] sm:text-[14px] md:text-[16px] text-[#464646]">
        Explore stories, tips, and guides from our tech community.
      </p>

      {/* MAIN */}
      <div className="relative mt-[40px] md:mt-[50px] max-w-[1200px] mx-auto flex items-center gap-2">

        {/* LEFT BUTTON (hidden on small screens) */}
        <button
          onClick={prev}
          className="hidden sm:flex z-10 shrink-0 w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-[#00B8C6] rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <IoIosArrowBack />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties}
        >
          <style>{`.blog-scroll::-webkit-scrollbar { display: none; }`}</style>

          <div className="blog-scroll flex">
            {blogs.map((blog, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={i}
                  className="shrink-0 w-full flex flex-col md:flex-row items-center justify-center gap-[20px] md:gap-[32px] py-6"
                  style={{
                    scrollSnapAlign: "start",
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                    transform: isActive ? "scale(1)" : "scale(0.95)",
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {/* IMAGE */}
                  <div
                    className="relative w-full max-w-[487px] h-[200px] sm:h-[230px] md:h-[246px] group overflow-hidden rounded-[12px]"
                    style={{
                      boxShadow: isActive
                        ? "0 20px 50px rgba(0,184,198,0.25), 0 6px 20px rgba(0,0,0,0.12)"
                        : "none",
                      transition: "box-shadow 0.4s ease",
                    }}
                  >
                  <Image
  src={blog.image}
  alt=""
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover transition-all duration-500 group-hover:scale-105"
/>
                  </div>

                  {/* TEXT */}
                  <div className="text-left w-full max-w-[350px]">
                    <span className="text-[#00B8C6] border border-[#00B8C6] px-[10px] py-[4px] rounded-full text-[12px] sm:text-[14px]">
                      {blog.date}
                    </span>

                    <h3 className="mt-[10px] text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-[#2E2E2E] leading-[1.3]">
                      {blog.title}
                    </h3>

                    <p className="mt-[8px] text-[13px] sm:text-[14px] md:text-[16px] text-[#494949] leading-[1.6] text-justify">
                      {blog.desc}
                    </p>

                    <button className="mt-[10px] flex items-center gap-[6px] text-[#00B8C6] text-[14px] sm:text-[15px] font-medium group">
                      <span>Read More</span>
                      <MdOutlineArrowRightAlt className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-[6px]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT BUTTON (hidden on small screens) */}
        <button
          onClick={next}
          className="hidden sm:flex z-10 shrink-0 w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-[#00B8C6] rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-[8px] mt-[20px] md:mt-[24px]">
        {blogs.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "20px" : "8px",
              height: "8px",
              background: i === activeIndex ? "#00B8C6" : "#D1D1D1",
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <button className="mt-[30px] md:mt-[40px] px-[22px] md:px-[26px] py-[9px] md:py-[10px] bg-[#00B8C6] text-white rounded-full text-[14px] md:text-[17px] font-medium">
        Read More Blogs
      </button>

    </section>
  );
}