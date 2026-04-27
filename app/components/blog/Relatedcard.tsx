import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/app/types/blog";

interface RelatedCardProps {
  post: BlogPost;
}

export default function RelatedCard({ post }: RelatedCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          transition: "box-shadow 0.2s",
        }}
        className="hover:shadow-md group"
      >
        {/* Thumbnail */}
        <div style={{ position: "relative", width: "100%", height: "150px" }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="320px"
          />
        </div>

        <div style={{ padding: "14px" }}>
          {/* Date badge */}
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
              whiteSpace: "nowrap",
            }}
          >
            {post.date}
          </span>

          {/* Title */}
          <h4
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.45,
              marginBottom: "8px",
            }}
            className="group-hover:text-[#00BCD4] transition-colors"
          >
            {post.title}
          </h4>

          {/* Excerpt */}
          <p
            style={{
              fontSize: "12px",
              color: "#6B7280",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            {post.excerpt}
          </p>

          {/* Read More */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#00BCD4",
            }}
          >
            Read More
            <svg
              viewBox="0 0 36 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "32px", height: "10px", flexShrink: 0 }}
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
          </div>
        </div>
      </div>
    </Link>
  );
}