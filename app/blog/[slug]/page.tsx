import { notFound } from "next/navigation";
import Image from "next/image";
import blogPostsData from "@/app/data/blogPosts.json";
import { BlogDetail, BlogPost } from "@/app/types/blog";
import RelatedCard from "@/app/components/blog/Relatedcard";
import ParseteText from "@/app/components/blog/Parsetealtext";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const allPosts = blogPostsData as BlogDetail[];

function getPost(slug: string): BlogDetail | undefined {
  return allPosts.find((p) => p.slug === slug);
}

function getRelatedPosts(currentId: number): BlogPost[] {
  return allPosts.filter((p) => p.id !== currentId).slice(0, 5);
}

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post!.id);

  return (
    <main className="bg-white min-h-screen">

      {/* ── Hero — exact same structure as Abouthero ── */}
      <section className="bg-[#FDFDFD] pt-[40px] md:pt-[60px] px-4">
        <div className="max-w-[1100px] mx-auto">

          {/* Desktop */}
          <div className="
            hidden md:block group
            w-full h-[260px] md:h-[320px] lg:h-[358px]
            relative rounded-[12px] overflow-hidden
            bg-white border border-[#EAEAEA]
            shadow-[0_8px_30px_rgba(0,184,198,0.25)]
          ">
            <Image
              src={post!.image}
              alt={post!.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1100px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#00B8C6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
          </div>

          {/* Mobile */}
          <div className="md:hidden relative w-full h-[200px] rounded-[10px] overflow-hidden">
            <Image
              src={post!.image}
              alt={post!.title}
              fill
              priority
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* ── Content + Sidebar — same max-width and px-4 as hero ── */}
      <section className="px-4 pb-20">
        <div
          className="max-w-[1100px] mx-auto blog-detail-layout"
          style={{ paddingTop: "40px", display: "grid", gap: "40px" }}
        >

          {/* ── LEFT: Article ── */}
          <article>
            {/* Tags */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
              <TagPill label={post!.date} />
              {post!.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>

            {/* H1 */}
            <h1 style={{ fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: "18px" }}>
              <ParseteText text={post!.title} />
            </h1>

            {/* Intro */}
            <p style={{ fontSize: "16px", color: "#6B7280", lineHeight: 1.85, marginBottom: "40px" }}>
              {post!.intro}
            </p>

            {/* Sections */}
            {post!.sections.map((section, i) => {
              switch (section.type) {
                case "heading2":
                  return (
                    <h2 key={i} style={{ fontSize: "clamp(20px, 2.4vw, 26px)", fontWeight: 700, color: "#111827", lineHeight: 1.3, marginTop: "44px", marginBottom: "16px" }}>
                      <ParseteText text={section.text!} />
                    </h2>
                  );
                case "heading3":
                  return (
                    <h3 key={i} style={{ fontSize: "18px", fontWeight: 700, color: "#2e69e9ff", marginTop: "28px", marginBottom: "12px" }}>
                      <ParseteText text={section.text!} />
                    </h3>
                  );
                case "paragraph":
                  return (
                    <p key={i} style={{ fontSize: "16px", color: "#374151", lineHeight: 1.9, marginBottom: "18px" }}>
                      {section.text}
                    </p>
                  );
                case "bulletList":
                  return (
                    <ul key={i} style={{ paddingLeft: "22px", marginBottom: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {section.items!.map((item, j) => (
                        <li key={j} style={{ fontSize: "16px", color: "#374151", lineHeight: 1.75 }}>{item}</li>
                      ))}
                    </ul>
                  );
                case "proTip":
                  return (
                    <div key={i} style={{ backgroundColor: "#E0F7FA", borderRadius: "12px", padding: "20px 24px", marginTop: "28px", marginBottom: "28px" }}>
                      <span style={{ display: "inline-block", backgroundColor: "#00BCD4", color: "#fff", fontWeight: 700, fontSize: "12px", borderRadius: "6px", padding: "4px 12px", marginBottom: "12px", letterSpacing: "0.05em" }}>
                        ProTip!
                      </span>
                      <p style={{ fontSize: "15px", color: "#0E7490", lineHeight: 1.8, margin: 0 }}>
                        {section.tip}
                      </p>
                    </div>
                  );
                case "subSection":
                  return (
                    <div key={i} style={{ marginBottom: "18px" }}>
                      <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "10px" }}>{section.label}</p>
                      <ul style={{ paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {section.items!.map((item, j) => (
                          <li key={j} style={{ fontSize: "16px", color: "#374151", lineHeight: 1.75 }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </article>

          {/* ── RIGHT: Related Resources ── */}
          <aside>
            <div style={{ backgroundColor: "#F3F4F6", borderRadius: "16px", padding: "24px 20px", position: "sticky", top: "100px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "20px" }}>
                Related Resources
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {related.map((r) => (
                  <RelatedCard key={r.id} post={r} />
                ))}
              </div>
            </div>
          </aside>

        </div>
      </section>

      <style>{`
        .blog-detail-layout { grid-template-columns: 1fr 340px; }
        @media (max-width: 900px) {
          .blog-detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 500, color: "#00BCD4", border: "1.5px solid #00BCD4", borderRadius: "999px", padding: "4px 18px", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}