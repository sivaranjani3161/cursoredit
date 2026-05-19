import { fetchPublishedBlogs } from "@/shared/lib/api";
import BlogHero from "@/features/blog/components/BlogHero";
import BlogGrid from "@/features/blog/components/BlogGrid";

export const revalidate = 60; // ISR: re-fetch every 60s

export default async function BlogsPage() {
  const posts = await fetchPublishedBlogs();

  return (
    <main style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <BlogHero />
      <BlogGrid posts={posts} />
    </main>
  );
}
