"use client";

import rawData from "@/features/gallery/data/gallerydata.json";
import { GalleryItem } from "@/features/gallery/types/gallery";
import GalleryCard from "./GalleryCard";
import { useRouter } from "next/navigation";

const data = rawData as GalleryItem[];

export default function GalleryGrid() {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/gallery/${id}`);
  };

  return (
    <div className="mt-10 flex flex-col gap-6 md:gap-10">

      {/* ROW 1: square + wide */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr] md:items-stretch">
        <GalleryCard item={data[0]} onClick={handleClick} variant="square" />
        <GalleryCard item={data[1]} onClick={handleClick} variant="wide" />
      </div>

      {/* ROW 2: wide + square */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr] md:items-stretch">
        <GalleryCard item={data[2]} onClick={handleClick} variant="wide" />
        <GalleryCard item={data[3]} onClick={handleClick} variant="square" />
      </div>

      {/* ROW 3: square + wide */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr] md:items-stretch">
        <GalleryCard item={data[4]} onClick={handleClick} variant="square" />
        <GalleryCard item={data[5]} onClick={handleClick} variant="wide" />
      </div>

    </div>
  );
}