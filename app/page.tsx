import Hero from "@/app/components/Hero";
import MetricsSection from "@/app/components/MetricsSection";
import PartnersCarousel from "@/app/components/PartnersCarousel";
import CoursesSection from "@/app/components/CoursesSection";
import ApproachSection from "@/app/components/ApproachSection";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import VideoTestimonials from "./components/VideoTestimonials";
import BlogSection from "./components/Blogs";
import {
  fetchPublishedBlogs,
  fetchTextTestimonials,
  fetchVideoTestimonials,
} from "@/lib/api";

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