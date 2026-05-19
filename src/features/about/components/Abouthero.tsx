"use client";

import Image from "next/image";
import aboutData from "@/features/about/data/about.json";

export default function Abouthero() {
  return (
    <section className="bg-[#FDFDFD] py-[40px] md:py-[112px] px-4">

      <div className="max-w-[1100px] mx-auto flex flex-col items-center text-center">

   <div className="
  group
  w-full max-w-[1200px]
  h-[180px] sm:h-[260px] md:h-[320px] lg:h-[358px]
  relative rounded-[12px] overflow-hidden
  bg-white
  -mt-[30px] md:-mt-[50px]
  border border-[#EAEAEA]
  shadow-[0_8px_30px_rgba(0,184,198,0.25)]
">
  <Image
    src={aboutData.heroImage}
    alt="about"
    fill
    sizes="(max-width: 768px) 100vw, 1200px"
    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 active:scale-105"
  />
  <div className="absolute inset-0 bg-[#00B8C6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
</div>
        {/* TITLE */}
        <h2 className="
          mt-[30px] md:mt-[50px]
          text-[24px] sm:text-[32px] md:text-[54px]
          leading-[120%]
          font-medium
          text-[#2E2E2E]
        ">
          {aboutData.title.normal}{" "}
          <span className="text-[#00B8C6] font-bold">
            {aboutData.title.highlight}
          </span>
        </h2>

        {/* DESCRIPTION — Mobile: 3 justified paragraphs | md+: original single block */}
        <div className="mt-[12px] md:mt-[18px] max-w-[800px] w-full">

          {/* ── MOBILE ONLY (hidden on md+) ── */}
          <div className="flex flex-col gap-[14px] md:hidden text-left">
            <p className="text-[13px] leading-[170%] text-[#464646] text-justify">
              <span className="font-semibold text-[#2E2E2E]">At Finest Coder</span>
              , we've learned that building strong teams requires more than just hiring talent.
              It demands nurturing that talent to reach its full potential.
            </p>
            <p className="text-[13px] leading-[170%] text-[#464646] text-justify">
              Leveraging over a decade of experience in the industry, we created FinestCoder
              to transform promising coders into industry ready professionals. Our unique approach
              focuses on practical, hands-on training that directly addresses the skills and
              challenges coders face in the real world.
            </p>
            <p className="text-[13px] leading-[170%] text-[#464646] text-justify">
              Our goal is to refine and elevate their abilities, ensuring they are ready to make
              meaningful contributions in a fast paced tech environment. We are proud of our 90%
              success rate, turning coders into highly capable professionals within 100 days.
            </p>
          </div>

          {/* ── TABLET + DESKTOP (hidden on mobile) ── */}
          <p className="
            hidden md:block
            text-[16px]
            leading-[130%]
            text-[#464646]
            text-center
          ">
            {aboutData.description.map((item, i) => (
              <span key={i} className={item.bold ? "font-semibold text-[#2E2E2E]" : ""}>
                {item.text}
              </span>
            ))}
          </p>

        </div>

      </div>
    </section>
  );
}