"use client";

import { useState } from "react";
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

  return (
    <>
      {/* ── DESKTOP + TABLET ── */}
      <section
        className="hidden md:block"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}
      >
        <div
          style={{ display: "grid", gap: "28px" }}
          className="blog-grid-cols"
        >
          {visiblePosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}>
            <LoadMoreButton onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)} />
          </div>
        )}
      </section>

      {/* ── MOBILE ── */}
      <section className="md:hidden" style={{ padding: "24px 0 40px" }}>
        {visiblePosts[0] && (
          <div style={{ padding: "0 16px 20px" }}>
            <BlogCardMobile post={visiblePosts[0]} featured />
          </div>
        )}

        {visiblePosts.length > 1 && (
          <div
            style={{
              overflowX: "auto",
              display: "flex",
              gap: "14px",
              padding: "0 16px 20px",
              scrollbarWidth: "none",
            }}
          >
            {visiblePosts.slice(1, 3).map((post) => (
              <div key={post.id} style={{ minWidth: "260px", flexShrink: 0 }}>
                <BlogCardMobile post={post} />
              </div>
            ))}
          </div>
        )}

        {visiblePosts.length > 3 && (
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {visiblePosts.slice(3).map((post) => (
              <BlogCardMobile key={post.id} post={post} compact />
            ))}
          </div>
        )}

        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", padding: "0 16px" }}>
            <LoadMoreButton onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)} />
          </div>
        )}
      </section>

      <style>{`
        .blog-grid-cols {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 1024px) {
          .blog-grid-cols {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        section::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}

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
