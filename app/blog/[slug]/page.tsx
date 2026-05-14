import { notFound } from "next/navigation";
import Image from "next/image";
import {
  fetchPublishedBlogs,
  fetchBlogBySlug,
  fetchRelatedBlogs,
} from "@/lib/api";
import { ApiBlog, blogDisplayDate } from "@/app/types/blog";
import RelatedCard from "@/app/components/blog/Relatedcard";
import { safeUrl, isUnoptimized } from "@/lib/imageUtils";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await fetchPublishedBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch blog + all published (for related)
  const [post, allPublished] = await Promise.all([
    fetchBlogBySlug(slug),
    fetchPublishedBlogs(),
  ]);

  if (!post) notFound();

  const related = await fetchRelatedBlogs(post.id, post.relatedBlogIds, allPublished);
  const displayDate = blogDisplayDate(post);
  const hasImage = Boolean(post.coverImage);
  const imgSrc = safeUrl(post.coverImage);

  return (
    <main className="bg-white min-h-screen">

      {/* ── Hero image ── */}
      <section className="bg-[#FDFDFD] pt-[40px] md:pt-[60px] px-4">
        <div className="max-w-[1100px] mx-auto">

          {hasImage ? (
            <>
              {/* Desktop */}
              <div className="
                hidden md:block group
                w-full h-[260px] md:h-[320px] lg:h-[358px]
                relative rounded-[12px] overflow-hidden
                bg-white border border-[#EAEAEA]
                shadow-[0_8px_30px_rgba(0,184,198,0.25)]
              ">
                <Image
                  src={imgSrc!}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1100px"
                  unoptimized={isUnoptimized(imgSrc)}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#00B8C6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
              </div>
              {/* Mobile */}
              <div className="md:hidden relative w-full h-[200px] rounded-[10px] overflow-hidden">
                <Image
                  src={imgSrc!}
                  alt={post.title}
                  fill
                  priority
                  unoptimized={isUnoptimized(imgSrc)}
                  className="object-cover"
                />
              </div>
            </>
          ) : (
            /* Placeholder banner when no image */
            <div
              className="w-full rounded-[12px] border border-[#EAEAEA] shadow-[0_8px_30px_rgba(0,184,198,0.15)]"
              style={{
                height: "200px",
                background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "48px", opacity: 0.3 }}>📝</span>
            </div>
          )}

        </div>
      </section>

      {/* ── Content + Sidebar ── */}
      <section className="px-4 pb-20">
        <div
          className="max-w-[1100px] mx-auto blog-detail-layout"
          style={{ paddingTop: "40px", display: "grid", gap: "40px" }}
        >

          {/* ── LEFT: Article ── */}
          <article>
            {/* Tags + date */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
              {displayDate && <TagPill label={displayDate} />}
              {post.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(26px, 3.2vw, 36px)",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.25,
                marginBottom: "18px",
              }}
            >
              {post.title}
            </h1>

            {/* Excerpt / intro */}
            {post.excerpt && (
              <p
                style={{
                  fontSize: "16px",
                  color: "#6B7280",
                  lineHeight: 1.85,
                  marginBottom: "40px",
                  borderLeft: "3px solid #00BCD4",
                  paddingLeft: "16px",
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Rich-text content from admin */}
            {post.content ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p style={{ color: "#9CA3AF", fontStyle: "italic" }}>
                No content available.
              </p>
            )}
          </article>

          {/* ── RIGHT: Related Resources ── */}
          {related.length > 0 && (
            <aside>
              <div
                style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "16px",
                  padding: "24px 20px",
                  position: "sticky",
                  top: "100px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "20px",
                  }}
                >
                  Related Resources
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {related.map((r) => (
                    <RelatedCard key={r.id} post={r} />
                  ))}
                </div>
              </div>
            </aside>
          )}

        </div>
      </section>

      {/* Styles for layout + blog content HTML */}
      <style>{`
        .blog-detail-layout { grid-template-columns: 1fr 340px; }
        @media (max-width: 900px) {
          .blog-detail-layout { grid-template-columns: 1fr !important; }
        }

        /* Rich-text content styles */
        .blog-content { font-size: 16px; color: #374151; line-height: 1.9; }
        .blog-content h1,
        .blog-content h2 { font-size: clamp(20px, 2.4vw, 26px); font-weight: 700; color: #111827; margin-top: 44px; margin-bottom: 16px; line-height: 1.3; }
        .blog-content h3 { font-size: 18px; font-weight: 700; color: #2e69e9; margin-top: 28px; margin-bottom: 12px; }
        .blog-content p { margin-bottom: 18px; }
        .blog-content ul, .blog-content ol { padding-left: 22px; margin-bottom: 18px; display: flex; flex-direction: column; gap: 8px; }
        .blog-content li { line-height: 1.75; }
        .blog-content strong { font-weight: 700; color: #111827; }
        .blog-content em { font-style: italic; }
        .blog-content a { color: #00BCD4; text-decoration: underline; }
        .blog-content blockquote { background: #E0F7FA; border-left: 4px solid #00BCD4; border-radius: 8px; padding: 16px 20px; margin: 24px 0; color: #0E7490; }
        .blog-content img { max-width: 100%; border-radius: 8px; margin: 16px 0; }
        .blog-content pre { background: #1E293B; color: #E2E8F0; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 20px 0; font-size: 14px; }
        .blog-content code { background: #F1F5F9; color: #0F172A; border-radius: 4px; padding: 2px 6px; font-size: 14px; }
        .blog-content pre code { background: transparent; color: inherit; padding: 0; }
      `}</style>
    </main>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "12px",
        fontWeight: 500,
        color: "#00BCD4",
        border: "1.5px solid #00BCD4",
        borderRadius: "999px",
        padding: "4px 18px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}