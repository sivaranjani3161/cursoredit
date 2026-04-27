import Image from "next/image";

export default function BlogHero() {
  return (
    <section className="bg-[#FDFDFD] pt-[24px] pb-[40px] px-4">
      <div className="max-w-[1100px] mx-auto">

        <div className="
          group
          w-full
          h-[180px] sm:h-[260px] md:h-[320px] lg:h-[358px]
          relative rounded-[12px] overflow-hidden
          bg-white
          border border-[#EAEAEA]
          shadow-[0_8px_30px_rgba(0,184,198,0.25)]
        ">
          <Image
            src="/bloghero.png"
            alt="Finest Coder Blogs"
            fill
            sizes="(max-width: 768px) 100vw, 1100px"
            priority
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 active:scale-105"
          />
          <div className="absolute inset-0 bg-[#00B8C6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
        </div>

      </div>
    </section>
  );
}