import Link from "next/link";
import { ApiBlog, blogDisplayDate } from "@/features/blog/types/blog";
import { safeUrl } from "@/shared/lib/imageUtils";

interface RelatedCardProps {
  post: ApiBlog;
}

export default function RelatedCard({ post }: RelatedCardProps) {
  const hasImage = Boolean(post.coverImage);
  const imgSrc = safeUrl(post.coverImage);
  const displayDate = blogDisplayDate(post);

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "#ffffff", transition: "box-shadow 0.2s" }}
        className="hover:shadow-md group"
      >
        {/* Thumbnail */}
        <div style={{ position: "relative", width: "100%", height: "140px", backgroundColor: "#E0F7FA" }}>
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc!}
              alt={post.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
              <span style={{ fontSize: "28px", opacity: 0.3 }}>📝</span>
            </div>
          )}
        </div>

        <div style={{ padding: "14px" }}>
          {/* Date badge */}
          {displayDate && (
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
              {displayDate}
            </span>
          )}

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
          {post.excerpt && (
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
          )}

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
            <svg viewBox="0 0 36 12" fill="none" style={{ width: "32px", height: "10px", flexShrink: 0 }}>
              <line x1="0" y1="6" x2="28" y2="6" stroke="#00BCD4" strokeWidth="1.8" strokeLinecap="round" />
              <polyline points="22,1 28,6 22,11" stroke="#00BCD4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}