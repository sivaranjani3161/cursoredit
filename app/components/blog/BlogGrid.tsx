"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/app/components/blog/BlogCard";
import BlogCardMobile from "@/app/components/blog/Blogcardmobile";
import { BlogPost } from "@/app/types/blog";

interface BlogGridProps {
  posts: BlogPost[];
}

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

export default function BlogGrid({ posts }: BlogGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const featured = visiblePosts[0];
  const secondary = visiblePosts.slice(1, 3);  // 2-col mini grid
  const rest = visiblePosts.slice(3);           // compact stacked list

  return (
    <>
      {/* ══════════════════════════════════════════
          DESKTOP + TABLET
      ══════════════════════════════════════════ */}
      <section
        className="hidden md:block"
        style={{ padding: "48px 24px" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="blog-grid-cols" style={{ display: "grid", gap: "28px" }}>
            {visiblePosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {hasMore && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}>
              <LoadMoreButton onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)} />
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MOBILE  — 3-zone editorial layout
          ┌─────────────────────┐
          │   FEATURED  (hero)  │   full-width tall
          ├──────────┬──────────┤
          │  mini 2  │  mini 3  │   2-col grid
          ├──────────┴──────────┤
          │   compact 4         │   horizontal thumb
          │   compact 5         │
          │   compact 6         │
          └─────────────────────┘
      ══════════════════════════════════════════ */}
      <section
        className="md:hidden"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "20px 16px 48px 16px",
        }}
      >
        {/* ZONE 1 — Featured hero card */}
        {featured && (
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <BlogCardMobile post={featured} featured />
          </div>
        )}

        {/* ZONE 2 — 2-col mini cards */}
        {secondary.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              width: "100%",
              marginBottom: "12px",
            }}
          >
            {secondary.map((post) => (
              <MiniCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* ZONE 3 — Compact stacked list */}
        {rest.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            {rest.map((post) => (
              <BlogCardMobile key={post.id} post={post} compact />
            ))}
          </div>
        )}

        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
            <LoadMoreButton onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)} />
          </div>
        )}
      </section>

      <style>{`
        .blog-grid-cols { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1024px) {
          .blog-grid-cols { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────
   MiniCard — used in the 2-col grid zone
───────────────────────────────────────── */
function MiniCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Aspect-ratio image wrapper */}
        <div style={{ position: "relative", width: "100%", paddingTop: "62%", flexShrink: 0 }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: "cover", position: "absolute", top: 0, left: 0 }}
          />
        </div>

        {/* Text body */}
        <div style={{ padding: "10px", display: "flex", flexDirection: "column", flex: 1 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "9px",
              fontWeight: 600,
              color: "#00BCD4",
              border: "1.2px solid #00BCD4",
              borderRadius: "999px",
              padding: "2px 9px",
              marginBottom: "6px",
              whiteSpace: "nowrap",
              alignSelf: "flex-start",
            }}
          >
            {post.date}
          </span>
          <p
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.4,
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              margin: 0,
            }}
          >
            {post.title}
          </p>
          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#00BCD4",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Read More
            <svg viewBox="0 0 36 12" fill="none" style={{ width: "26px", height: "9px", flexShrink: 0 }}>
              <line x1="0" y1="6" x2="28" y2="6" stroke="#00BCD4" strokeWidth="1.8" strokeLinecap="round" />
              <polyline points="22,1 28,6 22,11" stroke="#00BCD4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   LoadMoreButton
───────────────────────────────────────── */
function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#00BCD4",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "14px",
        padding: "12px 44px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
        letterSpacing: "0.02em",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0097A7")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00BCD4")}
    >
      Load More
    </button>
  );
}