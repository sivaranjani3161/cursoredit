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
<div className="bg-red-500"> hi</div>
  // ── COMPACT (horizontal) ──
  if (compact) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "16px",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            background: "#fff",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", width: "88px", height: "88px", flexShrink: 0 }}>
            <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover", borderRadius: "8px" }} />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "88px" }}>
            <span style={{ fontSize: "10px", color: "#00BCD4" }}>{post.date}</span>

            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111827",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "34px",
              }}
            >
              {post.title}
            </p>

            <div style={{ fontSize: "12px", color: "#00BCD4", fontWeight: 600 }}>
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
          
          <div style={{ position: "relative", height: "220px" }}>
            <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} />
          </div>

          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "160px", // ⭐ fixed height
            }}
          >
            <span style={{ fontSize: "11px", color: "#00BCD4" }}>{post.date}</span>

            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#111827",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "38px",
              }}
            >
              {post.title}
            </h2>

            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "34px",
              }}
            >
              {post.excerpt}
            </p>

            <div style={{ fontSize: "13px", fontWeight: 600, color: "#00BCD4" }}>
              Read More →
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── DEFAULT ──
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ border: "1px solid #E5E7EB", borderRadius: "14px", overflow: "hidden", background: "#fff" }}>
        
        <div style={{ position: "relative", height: "180px" }}>
          <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} />
        </div>

        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "130px", // ⭐ fixed height
          }}
        >
          <span style={{ fontSize: "10px", color: "#00BCD4" }}>{post.date}</span>

          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "34px",
            }}
          >
            {post.title}
          </p>

          <div style={{ fontSize: "12px", fontWeight: 600, color: "#00BCD4" }}>
            Read More →
          </div>
        </div>
      </div>
    </Link>
  );
}