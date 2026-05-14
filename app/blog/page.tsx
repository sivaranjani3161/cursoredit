import { fetchPublishedBlogs } from "@/lib/api";
import BlogHero from "@/app/components/blog/BlogHero";
import BlogGrid from "@/app/components/blog/BlogGrid";

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
