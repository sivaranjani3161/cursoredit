"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/app/types/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group"
      style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
    >
      {/* ── Card shell ── */}
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
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
            className="group-hover:scale-105"
          />
        </div>

        {/* ── Body ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "20px",
          }}
        >
          {/* Date badge */}
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
            {post.date}
          </span>

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
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 12"
              fill="none"
              style={{
                width: "36px",
                height: "12px",
                transition: "transform 0.2s ease",
              }}
              className="group-hover:translate-x-1"
            >
              <line
                x1="0"
                y1="6"
                x2="28"
                y2="6"
                stroke="#00BCD4"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <polyline
                points="22,1 28,6 22,11"
                stroke="#00BCD4"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
