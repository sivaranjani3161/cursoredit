"use client";

import Image from "next/image";
import data from "@/app/data/about-feature.json";

export default function StatsSection() {
  return (
    <section className="bg-[#00B8C6] py-[60px] md:py-[90px]">

      <div className="w-full max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] mx-auto px-6 sm:px-10 md:px-16 lg:px-16">

        <div className="
          flex flex-col sm:flex-row
          justify-center
          gap-[20px] sm:gap-[24px] md:gap-[32px] lg:gap-[60px]
        ">

          {data.items.map((item, i) => (
            <div
              key={i}
              className="
                group
                flex items-center sm:flex-col
                gap-[24px] sm:gap-[14px]
                px-2 sm:px-0
                pb-[24px] sm:pb-0
                last:pb-0
                w-full sm:w-[220px] md:w-[240px]
                text-left sm:text-center
              "
            >
         {/* ICON BOX */}
<div
  className="
    w-[60px] h-[60px] shrink-0
    sm:w-[80px] sm:h-[80px]
    bg-white
    rounded-[16px]
    flex items-center justify-center
    transition-all duration-300 ease-out
    group-hover:-translate-y-2
    group-hover:shadow-lg
    active:-translate-y-2
    active:shadow-lg
  "
>
 <Image
  src={item.icon}
  alt={item.title}
  width={28}
  height={28}
  style={{ width: "auto", height: "auto" }}
  className="
    object-contain
    transition-transform duration-300 ease-out
    group-hover:scale-110
    active:scale-110
  "
/>
</div>

              {/* TEXT */}
              <div className="flex flex-col sm:items-center w-full">
                <h3 className="
                  text-white font-semibold
                  text-[16px] sm:text-[18px] md:text-[20px]
                  mb-[6px]
                  text-left sm:text-center
                  w-full
                ">
                  {item.title}
                </h3>

                <p className="
                  text-white/90
                  text-[13px] md:text-[14px]
                  leading-[150%]
                  text-left sm:text-center
                  max-w-[180px] md:max-w-[200px]
                ">
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