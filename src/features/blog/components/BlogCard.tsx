"use client";

import Link from "next/link";
import { ApiBlog, blogDisplayDate } from "@/features/blog/types/blog";
import { safeUrl } from "@/shared/lib/imageUtils";

interface BlogCardProps {
  post: ApiBlog;
}

export default function BlogCard({ post }: BlogCardProps) {
  const hasImage = Boolean(post.coverImage);
  const imgSrc = safeUrl(post.coverImage);
  const displayDate = blogDisplayDate(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group"
      style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
    >
      <div
        className="group-hover:shadow-md"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          backgroundColor: "#ffffff",
          transition: "box-shadow 0.25s ease",
        }}
      >
        {/* ── Thumbnail ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "210px",
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "#E0F7FA",
          }}
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc!}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                display: "block",
              }}
              className="group-hover:scale-105"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)",
              }}
            >
              <span style={{ fontSize: "40px", opacity: 0.3 }}>📝</span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "16px" }}>
          {/* Date badge */}
          {displayDate && (
            <span
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                fontSize: "11px",
                fontWeight: 500,
                color: "#00BCD4",
                border: "1.5px solid #00BCD4",
                borderRadius: "999px",
                padding: "4px 18px",
                marginBottom: "14px",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}
            >
              {displayDate}
            </span>
          )}

          {/* Title */}
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.45,
              marginBottom: "10px",
              transition: "color 0.2s",
            }}
            className="group-hover:text-[#00BCD4]"
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: 1.7,
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Tags row */}
          {post.tags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "#6B7280",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "999px",
                    padding: "2px 10px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More */}
          <div
            style={{
              marginTop: "18px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#00BCD4",
            }}
          >
            Read More
            <svg
              viewBox="0 0 36 12"
              fill="none"
              style={{ width: "36px", height: "12px", transition: "transform 0.2s ease" }}
              className="group-hover:translate-x-1"
            >
              <line x1="0" y1="6" x2="28" y2="6" stroke="#00BCD4" strokeWidth="1.8" strokeLinecap="round" />
              <polyline points="22,1 28,6 22,11" stroke="#00BCD4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
