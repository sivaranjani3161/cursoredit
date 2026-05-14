"use client";

import Image from "next/image";
import Link from "next/link";
import heroData from "@/app/data/hero.json";

export default function Hero() {
  return (
    <section className="w-full bg-[#FDFDFD] pb-16 md:pb-20 overflow-hidden pt-[10px]">
<div className="max-w-[1180px] mx-auto px-6 lg:px-8">
        {/* HERO TEXT */}
<div className="relative bg-white/60 rounded-[16px] md:rounded-[20px]
overflow-hidden pt-[60px] md:pt-[120px]
pb-[80px] md:pb-[180px]
min-h-[400px] md:min-h-[520px]
flex items-center justify-center">          
  <Image
  src="/hero-bg.png"
  alt="bg"
  fill
  priority
  loading="eager"
  sizes="100vw"
  className="object-cover"
/>

          <div className="relative z-10 flex flex-col items-center text-center px-2 justify-center">

            <h1 className="max-w-[716px] text-[24px] leading-[32px] sm:text-[32px] sm:leading-[42px] md:text-[54px] md:leading-[65px] font-medium text-[#2E2E2E]">
              Start Coding{" "}
              <span className="text-[#00B8C6] inline-flex items-center font-semibold leading-none">
                <span>T</span>

                <Image
                  src="/od.png"
                  alt="od"
                  width={40}
                  height={40}
                  className="
                    inline-block
                    ml-[-2px] mr-[1px] -translate-y-[2px]
                    w-[20px] h-[20px]

                    sm:ml-[-3px] sm:-translate-y-[2.5px]
                    sm:w-[26px] sm:h-[26px]

                    md:ml-[-4px] md:-translate-y-[4px]
                    md:w-[48px] md:h-[48px]

                    lg:ml-[-4px] lg:-translate-y-[3px]
                    lg:w-[52px] lg:h-[45px]
                  "
                />

                <span>ay.</span>
              </span>{" "}
              Build What Matters{" "}
              <span className="text-[#00B8C6] font-semibold">
                Tomorrow.
              </span>
            </h1>

            <p className="mt-[12px] md:mt-[18px] max-w-[540px] text-[13px] sm:text-[14px] md:text-[18px] text-[#464646] font-medium">
              {heroData.subtitle}
            </p>

          <Link href="/about"
            className="mt-[20px] md:mt-[44px] inline-flex items-center bg-[#00B8C6] text-white px-5 sm:px-6 md:px-10 h-[40px] md:h-[52px] rounded-full text-[13px] sm:text-[14px] md:text-[16px] font-semibold cursor-pointer hover:opacity-90 active:scale-[0.97] transition"
          >
            Learn More
          </Link>
          </div>
        </div>

        {/* IMAGE STACK */}
        <div className="relative md:-mt-[130px] flex justify-center">

          <div className="relative hidden md:flex justify-center h-[280px] lg:h-[320px] w-full max-w-[900px]">

            {/* ✅ CENTERED WRAPPER (FIX) */}
            <div className="relative w-[520px] md:w-[600px] lg:w-[900px]">

              {/* CARD 1 */}
              <div className="absolute left-[5%] md:left-[8%] lg:left-[0%] top-[40px] rotate-[-12deg] group
                w-[140px] h-[180px]
                md:w-[150px] md:h-[190px]
                lg:w-[239px] lg:h-[270px]
                border-[4px] lg:border-[5px] border-white rounded-[12px] shadow-lg overflow-hidden">
<Image
  src="/img1.png"
  alt=""
  fill
  sizes="(max-width: 768px) 140px, (max-width: 1024px) 150px, 239px"
  className="object-cover transition-transform duration-300 group-hover:scale-105 active:scale-105"
/>              </div>

              {/* CARD 2 */}
              <div className="absolute left-[28%] md:left-[30%] lg:left-[210px] top-[30px] group
                w-[140px] h-[180px]
                md:w-[150px] md:h-[190px]
                lg:w-[240px] lg:h-[270px]
                border-[4px] lg:border-[5px] border-white rounded-[12px] shadow-lg overflow-hidden z-10">
<Image
  src="/hero2.png"
  alt=""
  fill
  sizes="(max-width: 768px) 140px, (max-width: 1024px) 150px, 240px"
  className="object-cover transition-transform duration-300 group-hover:scale-105 active:scale-105"
/>              </div>

              {/* CARD 3 */}
              <div className="absolute left-[48%] md:left-[52%] lg:left-[50%] top-[30px] rotate-[8deg] group
                w-[140px] h-[180px]
                md:w-[150px] md:h-[190px]
                lg:w-[239px] lg:h-[270px]
                border-[4px] lg:border-[5px] border-white rounded-[12px] shadow-lg overflow-hidden z-20">
<Image
  src="/img3.png"
  alt=""
  fill
  sizes="(max-width: 768px) 140px, (max-width: 1024px) 150px, 239px"
  className="object-cover transition-transform duration-300 group-hover:scale-105 active:scale-105"
/>              </div>

              {/* CARD 4 */}
              <div className="absolute left-[70%] md:left-[74%] lg:left-[75%] top-[45px] rotate-[-5deg] group
                w-[140px] h-[180px]
                md:w-[150px] md:h-[190px]
                lg:w-[239px] lg:h-[270px]
                border-[4px] lg:border-[5px] border-white rounded-[12px] shadow-lg overflow-hidden">
<Image
  src="/img4.png"
  alt=""
  fill
  sizes="(max-width: 768px) 140px, (max-width: 1024px) 150px, 239px"
  className="object-cover transition-transform duration-300 group-hover:scale-105 active:scale-105"
/>              </div>

            </div>

            {/* GLOW */}
            <div className="absolute bottom-[-20px] left-[50px] right-[50px] h-[50px] blur-3xl opacity-40 bg-[radial-gradient(ellipse,#00C8D7_0%,transparent_70%)]" />

          </div>
        </div>

      </div>
    </section>
  );
}