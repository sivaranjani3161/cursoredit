import Link from "next/link";
import data from "@/app/data/CourseEnroll.json";

export default function EnrollCourse() {
  const { enrollBanner } = data;

  return (
<section className="w-full px-4 sm:px-6 lg:px-8 pb-0 relative z-10 -mb-[25px] md:-mb-[50px]">      <div
        className="max-w-[800px] mx-auto rounded-2xl px-6 py-14 md:py-10 flex flex-col items-center justify-center text-center bg-[#00B8C6]"
      >
        <h2
          className="text-white mb-4"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 500,
            fontSize: "32px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          {enrollBanner.normalTitle}{" "}
          <strong style={{ fontWeight: 700 }}>{enrollBanner.boldTitle}</strong>
        </h2>

        <p
          className="text-white mb-8 max-w-[520px]"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "150%",
            letterSpacing: "0%",
          }}
        >
          {enrollBanner.description}
        </p>

        <Link
          href={enrollBanner.buttonLink}
          className="bg-white text-[#00B8C6] font-semibold text-[15px] px-8 py-3 rounded-full hover:bg-opacity-90 transition"
          style={{ fontFamily: "Urbanist, sans-serif" }}
        >
                    <button className="cursor-pointer">Register Now</button>

        </Link>
      </div>
    </section>
  );
}