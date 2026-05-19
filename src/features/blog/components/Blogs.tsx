"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { ApiBlog, blogDisplayDate } from "@/features/blog/types/blog";

interface BlogSectionProps {
  posts: ApiBlog[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, posts.length - 1));
    const container = scrollRef.current;
    if (!container) return;
    setActiveIndex(clamped);
    container.scrollTo({ left: clamped * container.offsetWidth, behavior: "smooth" });
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

  // ── Empty state ──
  if (posts.length === 0) {
    return (
      <section className="bg-[#FDFDFD] py-[60px] md:py-[80px] text-center px-4">
        <h2 className="text-[26px] sm:text-[32px] md:text-[54px] text-[#2E2E2E]">
          Our <span className="font-bold">Awesome Blog</span>
        </h2>
        <p className="mt-[10px] text-[13px] sm:text-[14px] md:text-[16px] text-[#464646]">
          Explore stories, tips, and guides from our tech community.
        </p>
        <p className="mt-[40px] text-[#9CA3AF] text-[15px]">
          No blogs published yet — check back soon!
        </p>
        <Link
          href="/blog"
          className="inline-block mt-[24px] px-[22px] md:px-[26px] py-[9px] md:py-[10px] bg-[#00B8C6] text-white rounded-full text-[14px] md:text-[17px] font-medium"
        >
          Visit Blog
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-[#FDFDFD] py-[60px] md:py-[80px] text-center overflow-hidden px-4">

      {/* Title */}
      <h2 className="text-[26px] sm:text-[32px] md:text-[54px] text-[#2E2E2E]">
        Our <span className="font-bold">Awesome Blog</span>
      </h2>
      <p className="mt-[10px] md:mt-[12px] text-[13px] sm:text-[14px] md:text-[16px] text-[#464646]">
        Explore stories, tips, and guides from our tech community.
      </p>

      {/* Carousel */}
      <div className="relative mt-[40px] md:mt-[50px] max-w-[1200px] mx-auto flex items-center gap-2">

        {/* Left arrow */}
        <button
          onClick={prev}
          className="hidden sm:flex z-10 shrink-0 w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-[#00B8C6] rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <IoIosArrowBack />
        </button>

        {/* Scroll container */}
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
            {posts.map((blog, i) => {
              const isActive = i === activeIndex;
              const displayDate = blogDisplayDate(blog);
              const hasImage = Boolean(blog.coverImage);

              return (
                <div
                  key={blog.id}
                  className="shrink-0 w-full flex flex-col md:flex-row items-center justify-center gap-[20px] md:gap-[32px] py-6"
                  style={{
                    scrollSnapAlign: "start",
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                    transform: isActive ? "scale(1)" : "scale(0.95)",
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative w-full max-w-[487px] h-[200px] sm:h-[230px] md:h-[246px] overflow-hidden rounded-[12px]"
                    style={{
                      boxShadow: isActive
                        ? "0 20px 50px rgba(0,184,198,0.25), 0 6px 20px rgba(0,0,0,0.12)"
                        : "none",
                      transition: "box-shadow 0.4s ease",
                      flexShrink: 0,
                    }}
                  >
                    {hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blog.coverImage!}
                        alt={blog.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        className="transition-all duration-500 hover:scale-105"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "48px", opacity: 0.3 }}>📝</span>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="text-left w-full max-w-[350px]">
                    {displayDate && (
                      <span className="text-[#00B8C6] border border-[#00B8C6] px-[10px] py-[4px] rounded-full text-[12px] sm:text-[14px]">
                        {displayDate}
                      </span>
                    )}

                    <h3 className="mt-[10px] text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-[#2E2E2E] leading-[1.3]">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="mt-[8px] text-[13px] sm:text-[14px] md:text-[16px] text-[#494949] leading-[1.6] text-justify line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-[6px] mt-[10px]">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-[#6B7280] bg-[#F3F4F6] rounded-full px-[10px] py-[2px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="mt-[10px] flex items-center gap-[6px] text-[#00B8C6] text-[14px] sm:text-[15px] font-medium group"
                    >
                      <span>Read More</span>
                      <MdOutlineArrowRightAlt className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-[6px]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="hidden sm:flex z-10 shrink-0 w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-[#00B8C6] rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-[8px] mt-[20px] md:mt-[24px]">
        {posts.map((_, i) => (
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
      <Link
        href="/blog"
        className="inline-block mt-[30px] md:mt-[40px] px-[22px] md:px-[26px] py-[9px] md:py-[10px] bg-[#00B8C6] text-white rounded-full text-[14px] md:text-[17px] font-medium hover:bg-[#0097A7] transition-colors"
      >
        Read More Blogs
      </Link>

    </section>
  );
}