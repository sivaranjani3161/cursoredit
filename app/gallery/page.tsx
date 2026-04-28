import Carousel from "@/app/components/Gallery/Carousel";
import GalleryGrid from "@/app/components/Gallery/GalleryGrid";
import CollageGrid from "@/app/components/Gallery/CollageGrid";

export default function GalleryPage() {
  return (
<section className="w-full bg-[#FDFDFD] flex flex-col px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pb-14">
<div className="
  relative

  w-screen
  left-1/2 -translate-x-1/2

  sm:w-full
  sm:left-0 sm:translate-x-0
  sm:max-w-[1200px]
  sm:mx-auto

  rounded-none sm:rounded-xl
  overflow-hidden

  shadow-none sm:shadow-[0_8px_30px_rgba(0,184,198,0.25)]

  mt-[38px]
">
  <Carousel />
</div>

      {/* Heading */}
      <div className="w-full max-w-[1200px] text-center mt-12">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Gallery of <span className="text-teal-500">Experiences</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Explore moments from our diverse events, capturing experiences,
          connections, and memories.
        </p>
      </div>

      {/* Folder Grid */}
      <div className="w-full max-w-[1200px]">
        <GalleryGrid />
      </div>

      {/* Collage Section */}
      <div className="w-full max-w-[1200px]">
        <CollageGrid />
      </div>

    </section>
  );
}