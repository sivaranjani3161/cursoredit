import Hero from "@/features/home/components/Hero";
import MetricsSection from "@/features/home/components/MetricsSection";
import PartnersCarousel from "@/features/home/components/PartnersCarousel";
import CoursesSection from "@/features/courses/components/CoursesSection";
import ApproachSection from "@/features/home/components/ApproachSection";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import Testimonials from "@/features/home/components/Testimonials";
import VideoTestimonials from "@/features/home/components/VideoTestimonials";
import BlogSection from "@/features/blog/components/Blogs";
import {
  fetchPublishedBlogs,
  fetchTextTestimonials,
  fetchVideoTestimonials,
} from "@/shared/lib/api";

export const revalidate = 60;

export default async function Home() {
  const [blogs, textTestimonials, videoTestimonials] = await Promise.all([
    fetchPublishedBlogs(),
    fetchTextTestimonials(),
    fetchVideoTestimonials(),
  ]);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Hero />
        {/* Metrics strip — above Our Featured Courses */}
        <MetricsSection />
        {/* MOU Partners infinite carousel */}
        <PartnersCarousel />
        <CoursesSection />
        <ApproachSection />
        <WhyChooseUs />
        <Testimonials items={textTestimonials} />
        <VideoTestimonials items={videoTestimonials} />
        <BlogSection posts={blogs} />
      </div>
    </main>
  );
}