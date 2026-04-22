"use client";

import Image from "next/image";
import featuresData from "@/app/data/features.json";

type Feature = {
  title: string;
  desc: string;
  icon: string;
};

const features: Feature[] = featuresData.features;

export default function WhyChooseUs() {
  return (
    <section className="bg-[#FDFDFD] py-[50px] md:py-[80px] px-4">

      <h2 className="text-center text-[26px] sm:text-[32px] md:text-[54px] text-[#2E2E2E]">
        Why <span className="font-bold">Choose Us</span>
      </h2>

      {/* ✅ FIXED WRAPPER (tablet handled) */}
      <div className="mt-[30px] md:mt-[40px] max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-[30px] md:gap-[40px]">

        {/* IMAGE */}
        <div className="relative w-full sm:w-[80%] md:w-[70%] lg:w-[480px] aspect-[498/528] shrink-0 mx-auto">
          <Image
            src="/why-img.png"
            alt="why"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover rounded-[12px]"
          />
        </div>

        {/* FEATURES */}
        <div className="flex flex-col gap-[12px] sm:gap-[16px] w-full md:max-w-[600px] lg:max-w-none mx-auto">

          {features.map((item, i) => (
            <div
              key={i}
              className="
                flex items-start sm:items-center gap-[12px] sm:gap-[16px]
                px-[14px] sm:px-[16px] py-[14px] sm:py-[16px]
                rounded-[12px]
                border transition-all duration-300
                bg-white shadow-md border-[#E5E5E5]
              "
            >

              {/* ICON */}
              <div className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] md:w-[84px] md:h-[84px] bg-[#00B8C6] rounded-[10px] flex items-center justify-center shrink-0">
  <Image
    src={item.icon}
    alt=""
    width={28}
    height={28}
    style={{ width: "auto", height: "auto" }}
  />
</div>

              {/* TEXT */}
              <div className="flex flex-col">

                <h3 className="text-[15px] sm:text-[16px] md:text-[20px] font-semibold text-[#2E2E2E]">
                  {item.title}
                </h3>

                <p className="mt-[4px] sm:mt-[6px] text-[13px] sm:text-[14px] md:text-[15px] text-[#5A5A5A] leading-[1.6] max-w-[520px]">
                  {item.desc}
                </p>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}