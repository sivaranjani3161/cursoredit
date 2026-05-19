"use client";

import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Props {
  images: string[];
}

export default function EventCollage({ images }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  if (!images || images.length < 6) {
    return <div className="mt-10 text-center text-gray-400">Not enough images</div>;
  }

  const slides = images.map((img) => ({ src: img }));

  return (
    <>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4 h-[320px] md:h-[380px]">
          <img
            src={images[0]}
            onClick={() => setIndex(0)}
            className="w-full h-[60%] object-cover rounded-xl cursor-pointer hover:opacity-90"
          />
          <div className="grid grid-cols-2 gap-4 h-[40%]">
            <img
              src={images[1]}
              onClick={() => setIndex(1)}
              className="h-full object-cover rounded-xl w-full cursor-pointer hover:opacity-90"
            />
            <img
              src={images[2]}
              onClick={() => setIndex(2)}
              className="h-full object-cover rounded-xl w-full cursor-pointer hover:opacity-90"
            />
          </div>
        </div>

        {/* CENTER */}
        <div>
          <img
            src={images[3]}
            onClick={() => setIndex(3)}
            className="w-full h-[320px] md:h-[380px] object-cover rounded-xl cursor-pointer hover:opacity-90"
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <img
            src={images[4]}
            onClick={() => setIndex(4)}
            className="w-full h-[160px] md:h-[180px] object-cover rounded-xl cursor-pointer hover:opacity-90"
          />
          <img
            src={images[5]}
            onClick={() => setIndex(5)}
            className="w-full h-[160px] md:h-[180px] object-cover rounded-xl cursor-pointer hover:opacity-90"
          />
        </div>
      </div>

      {/* ✅ LIGHTBOX */}
      <Lightbox
        open={index !== null}
        close={() => setIndex(null)}
        slides={slides}
        index={index ?? 0}
      />
    </>
  );
}