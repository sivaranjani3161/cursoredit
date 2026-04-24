"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/app/types/blog";

interface BlogCardMobileProps {
  post: BlogPost;
  featured?: boolean;
  compact?: boolean;
}

export default function BlogCardMobile({
  post,
  featured = false,
  compact = false,
}: BlogCardMobileProps) {
  // ── Compact variant: horizontal card with left thumbnail ──
  if (compact) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            overflow: "hidden",
            padding: "12px",
            transition: "box-shadow 0.2s",
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              position: "relative",
              width: "88px",
              height: "88px",
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 500,
                color: "#00BCD4",
                border: "1.5px solid #00BCD4",
                borderRadius: "999px",
                padding: "2px 12px",
                marginBottom: "8px",
                whiteSpace: "nowrap",
              }}
            >
              {post.date}
            </span>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: "8px",
              }}
            >
              {post.title}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#00BCD4",
              }}
            >
              Read More
              <LongArrow />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── Featured variant: tall card, large image, bigger text ──
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #E5E7EB",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "220px" }}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div style={{ padding: "18px" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 500,
                color: "#00BCD4",
                border: "1.5px solid #00BCD4",
                borderRadius: "999px",
                padding: "4px 18px",
                marginBottom: "12px",
              }}
            >
              {post.date}
            </span>
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.4,
                marginBottom: "10px",
              }}
            >
              {post.title}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: 1.65,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: "14px",
              }}
            >
              {post.excerpt}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#00BCD4",
              }}
            >
              Read More <LongArrow />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── Default variant: standard card for horizontal scroll strip ──
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "150px", flexShrink: 0 }}>
          <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} />
        </div>
        <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "10px",
              fontWeight: 500,
              color: "#00BCD4",
              border: "1.5px solid #00BCD4",
              borderRadius: "999px",
              padding: "3px 14px",
              marginBottom: "10px",
              alignSelf: "flex-start",
            }}
          >
            {post.date}
          </span>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.4,
              marginBottom: "8px",
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#00BCD4",
              marginTop: "auto",
              paddingTop: "8px",
            }}
          >
            Read More <LongArrow />
          </div>
        </div>
      </div>
    </Link>
  );
}

function LongArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 12"
      fill="none"
      style={{ width: "34px", height: "11px", flexShrink: 0 }}
    >
      <line x1="0" y1="6" x2="28" y2="6" stroke="#00BCD4" strokeWidth="1.8" strokeLinecap="round" />
      <polyline
        points="22,1 28,6 22,11"
        stroke="#00BCD4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
