import { notFound } from "next/navigation";
import Image from "next/image";
import blogPostsData from "@/app/data/blogPosts.json";
import { BlogDetail, BlogPost } from "@/app/types/blog";
import RelatedCard from "@/app/components/blog/Relatedcard";
import ParseteText from "@/app/components/blog/Parsetealtext";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Data helpers ──────────────────────────────────────────────────────────────

const allPosts = blogPostsData as BlogDetail[];

function getPost(slug: string): BlogDetail | undefined {
  return allPosts.find((p) => p.slug === slug);
}

function getRelatedPosts(currentId: number): BlogPost[] {
  return allPosts.filter((p) => p.id !== currentId).slice(0, 5);
}

// ── Static params (SSG) ───────────────────────────────────────────────────────

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();        // ← new  if (!post) notFound();

  const related = getRelatedPosts(post.id);

  return (
    <main style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>

      {/* ── Hero Image: desktop ── */}
      <div
        className="hidden md:block"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 0" }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(260px, 32vw, 380px)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      {/* ── Hero Image: mobile ── */}
      <div
        className="md:hidden"
        style={{ position: "relative", width: "100%", height: "220px" }}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* ── Content + Sidebar grid ── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "grid",
          gap: "40px",
        }}
        className="blog-detail-layout"
      >
        {/* ── LEFT: Article content ── */}
        <article>
          {/* Tags row */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <TagPill label={post.date} />
            {post.tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.3,
              marginBottom: "16px",
            }}
          >
            <ParseteText text={post.title} />
          </h1>

          {/* Intro paragraph */}
          <p
            style={{
              fontSize: "14px",
              color: "#6B7280",
              lineHeight: 1.8,
              marginBottom: "36px",
            }}
          >
            {post.intro}
          </p>

          {/* Dynamic sections */}
          {post.sections.map((section, i) => {
            switch (section.type) {
              case "heading2":
                return (
                  <h2
                    key={i}
                    style={{
                      fontSize: "clamp(18px, 2.2vw, 24px)",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.35,
                      marginTop: "36px",
                      marginBottom: "14px",
                    }}
                  >
                    <ParseteText text={section.text!} />
                  </h2>
                );

              case "heading3":
                return (
                  <h3
                    key={i}
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#111827",
                      marginTop: "24px",
                      marginBottom: "10px",
                    }}
                  >
                    <ParseteText text={section.text!} />
                  </h3>
                );

              case "paragraph":
                return (
                  <p
                    key={i}
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      lineHeight: 1.85,
                      marginBottom: "16px",
                    }}
                  >
                    {section.text}
                  </p>
                );

              case "bulletList":
                return (
                  <ul
                    key={i}
                    style={{
                      paddingLeft: "20px",
                      marginBottom: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {section.items!.map((item, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: 1.7,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                );

              case "proTip":
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#E0F7FA",
                      borderRadius: "10px",
                      padding: "18px 22px",
                      marginTop: "24px",
                      marginBottom: "24px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "#00BCD4",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "12px",
                        borderRadius: "6px",
                        padding: "3px 10px",
                        marginBottom: "10px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      ProTip!
                    </span>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#0E7490",
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {section.tip}
                    </p>
                  </div>
                );

              case "subSection":
                return (
                  <div key={i} style={{ marginBottom: "16px" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "8px",
                      }}
                    >
                      {section.label}
                    </p>
                    <ul
                      style={{
                        paddingLeft: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {section.items!.map((item, j) => (
                        <li
                          key={j}
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            lineHeight: 1.7,
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );

              default:
                return null;
            }
          })}
        </article>

        {/* ── RIGHT: Related Resources sidebar ── */}
        <aside>
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
        </aside>
      </div>

      {/* ── Layout styles ── */}
      <style>{`
        .blog-detail-layout {
          grid-template-columns: 1fr 340px;
        }
        @media (max-width: 900px) {
          .blog-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

// ── Tag pill sub-component ────────────────────────────────────────────────────

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
