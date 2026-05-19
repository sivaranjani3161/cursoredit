"use client";

import { GalleryItem } from "@/features/gallery/types/gallery";

interface Props {
  item: GalleryItem;
  onClick: (id: string) => void;
  variant?: "square" | "wide";
}

export default function GalleryCard({
  item,
  onClick,
  variant = "square",
}: Props) {
  const backImage1 = item.backImage1 ?? item.image;
  const backImage2 = item.backImage2 ?? item.image;

  return (
    <div
      onClick={() => onClick(item.id)}
      className="relative cursor-pointer h-[200px] sm:h-[220px] md:h-[240px] w-full pb-[6px]"
    >
      {/* BACK IMAGE 2 */}
      <div className="absolute inset-0 rounded-[16px] overflow-hidden rotate-[-2deg] translate-x-[4px] translate-y-[4px] opacity-60 z-0">
        <img src={backImage2} className="w-full h-full object-cover" />
      </div>

      {/* BACK IMAGE 1 */}
      <div className="absolute inset-0 rounded-[16px] overflow-hidden rotate-[1deg] translate-x-[3px] translate-y-[3px] opacity-80 z-[1]">
        <img src={backImage1} className="w-full h-full object-cover" />
      </div>

      {/* FRONT */}
      <div className="relative z-[2] rounded-[16px] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.12)] h-full">
        <img src={item.image} className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-sm font-medium">{item.title}</h3>
          <p className="text-xs opacity-90">{item.subtitle}</p>
        </div>

        <div className="absolute bottom-4 right-4 w-7 h-7 flex items-center justify-center bg-[#00B8C6] rounded-full text-white">
          →
        </div>
      </div>
    </div>
  );
}