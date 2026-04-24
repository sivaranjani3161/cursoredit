import blogPostsData from "@/app/data/blogPosts.json";
import { BlogPost } from "@/app/types/blog";
import BlogHero from "@/app/components/blog/BlogHero";
import BlogGrid from "@/app/components/blog/BlogGrid";

export default function BlogsPage() {
  const posts = blogPostsData as BlogPost[];

  return (
    <main style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <BlogHero />
      <BlogGrid posts={posts} />
    </main>
  );
}
