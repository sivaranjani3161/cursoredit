import Image from "next/image";
import heroData from "@/app/data/Courseherodata.json";

export default function CourseHero() {
  const { hero } = heroData;

  return (
    <section className="w-full bg-[#FDFDFD] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pb-14">
      {/* Hero Banner Image */}
      <div className="w-full max-w-[1200px] rounded-xl overflow-hidden">
        <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[358px] bg-gray-200 rounded-xl overflow-hidden">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Text + CTA */}
      <div className="mt-8 md:mt-10 flex flex-col items-center gap-4 md:gap-5 max-w-[700px] w-full text-center">
        {/* Heading */}
        <h1 className="text-[20px] sm:text-[26px] md:text-[36px] lg:text-[44px]">
          <span className="font-medium text-[#2E2E2E]">{hero.titleNormal}</span>
          <span className="font-bold text-[#2E2E2E]">{hero.titleBold}</span>
        </h1>

        {/* Description */}
        <p className="font-normal text-[13px] sm:text-[14px] md:text-[15px] text-[#2E2E2E]/70 leading-relaxed max-w-[560px] px-2">
          {hero.description}
        </p>

        {/* CTA Button */}
        <button className="mt-2 px-8 py-2.5 rounded-full text-white text-[15px] font-semibold bg-[#00B8C6] hover:bg-[#009aab] transition-colors duration-200 cursor-pointer">
          Join Now!
        </button>
      </div>
    </section>
  );
}