"use client";

import Link from "next/link";
import { ApiBlog, blogDisplayDate } from "@/app/types/blog";
import { safeUrl } from "@/lib/imageUtils";

interface BlogCardMobileProps {
  post: ApiBlog;
  featured?: boolean;
  compact?: boolean;
}

function ImageBlock({
  src,
  alt,
  height,
  borderRadius = "0",
}: {
  src: string | null;
  alt: string;
  height: string;
  borderRadius?: string;
}) {
  const safeSrc = safeUrl(src);
  if (safeSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={safeSrc}
        alt={alt}
        style={{
          width: "100%",
          height,
          objectFit: "cover",
          display: "block",
          borderRadius,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius,
        background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: "24px", opacity: 0.35 }}>📝</span>
    </div>
  );
}

export default function BlogCardMobile({
  post,
  featured = false,
  compact = false,
}: BlogCardMobileProps) {
  const displayDate = blogDisplayDate(post);

  // ── COMPACT (horizontal) ──
  if (compact) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "14px",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            background: "#fff",
            alignItems: "center",
          }}
        >
          <div style={{ width: "80px", height: "80px", flexShrink: 0, borderRadius: "8px", overflow: "hidden" }}>
            <ImageBlock src={post.coverImage} alt={post.title} height="80px" borderRadius="8px" />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
            {displayDate && (
              <span style={{ fontSize: "10px", color: "#00BCD4" }}>{displayDate}</span>
            )}
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111827",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
              }}
            >
              {post.title}
            </p>
            <div style={{ fontSize: "12px", color: "#00BCD4", fontWeight: 600, marginTop: "4px" }}>
              Read More →
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── FEATURED ──
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
          <ImageBlock src={post.coverImage} alt={post.title} height="220px" />
          <div style={{ padding: "16px" }}>
            {displayDate && (
              <span style={{ fontSize: "11px", color: "#00BCD4" }}>{displayDate}</span>
            )}
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#111827",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: "8px 0",
              }}
            >
              {post.title}
            </h2>
            {post.excerpt && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  margin: "0 0 12px",
                }}
              >
                {post.excerpt}
              </p>
            )}
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#00BCD4" }}>Read More →</div>
          </div>
        </div>
      </Link>
    );
  }

  // ── DEFAULT ──
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ border: "1px solid #E5E7EB", borderRadius: "14px", overflow: "hidden", background: "#fff" }}>
        <ImageBlock src={post.coverImage} alt={post.title} height="180px" />
        <div style={{ padding: "14px" }}>
          {displayDate && (
            <span style={{ fontSize: "10px", color: "#00BCD4" }}>{displayDate}</span>
          )}
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              margin: "6px 0",
            }}
          >
            {post.title}
          </p>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#00BCD4" }}>Read More →</div>
        </div>
      </div>
    </Link>
  );
}