"use client";

import { useState } from "react";
import Link from "next/link";
import BlogCard from "@/features/blog/components/BlogCard";
import BlogCardMobile from "@/features/blog/components/Blogcardmobile";
import { ApiBlog } from "@/features/blog/types/blog";
import { safeUrl } from "@/shared/lib/imageUtils";

interface BlogGridProps {
  posts: ApiBlog[];
}

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

export default function BlogGrid({ posts }: BlogGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Empty state
  if (posts.length === 0) {
    return (
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "56px", opacity: 0.25 }}>📰</div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: 0 }}>
            No blogs published yet
          </h2>
          <p style={{ fontSize: "15px", color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
            Check back soon — we're working on some great content for you.
          </p>
        </div>
      </section>
    );
  }

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const featured = visiblePosts[0];
  const secondary = visiblePosts.slice(1, 3);
  const rest = visiblePosts.slice(3);

  return (
    <>
      {/* ── DESKTOP ── */}
      <section className="hidden md:block" style={{ padding: "48px 24px" }}>
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

      {/* ── MOBILE ── */}
      <section
        className="md:hidden"
        style={{ width: "100%", boxSizing: "border-box", padding: "20px 16px 48px 16px" }}
      >
        {/* Zone 1 — Featured hero card */}
        {featured && (
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <BlogCardMobile post={featured} featured />
          </div>
        )}

        {/* Zone 2 — 2-col mini cards */}
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

        {/* Zone 3 — Compact stacked list */}
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
        @media (max-width: 640px) {
          .blog-grid-cols { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </>
  );
}

/* ── MiniCard (mobile 2-col zone) ── */
function MiniCard({ post }: { post: ApiBlog }) {
  const hasImage = Boolean(post.coverImage);
  const imgSrc = safeUrl(post.coverImage);
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
        {/* Image */}
        <div style={{ position: "relative", width: "100%", paddingTop: "62%", flexShrink: 0, backgroundColor: "#E0F7FA" }}>
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc!}
              alt={post.title}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)",
              }}
            >
              <span style={{ fontSize: "20px", opacity: 0.4 }}>📝</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ padding: "10px", display: "flex", flexDirection: "column", flex: 1 }}>
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

/* ── LoadMoreButton ── */
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