"use client";

import { useState } from "react";
import { collageData } from "@/features/gallery/data/collageData";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function CollageGrid() {
  const [index, setIndex] = useState<number | null>(null);

  const images = collageData.map((item) => ({
    src: item.image,
  }));

  const magazineBlocks: (typeof collageData)[] = [];
  for (let i = 0; i < collageData.length; i += 3) {
    magazineBlocks.push(collageData.slice(i, i + 3));
  }

  return (
    <>
      <div className="mt-12 sm:mt-16 md:mt-20">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Our Awesome Clicks{" "}
            <span className="text-teal-500">@ finestcoder</span>
          </h2>
        </div>

        {/* TABLET */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 auto-rows-[150px] gap-4">
          {collageData.map((item, idx) => {
            const isLastAlone =
              idx === collageData.length - 1 &&
              collageData.length % 2 !== 0;

            return (
              <div
                key={item.id}
                onClick={() => setIndex(idx)}
                className={`${
                  isLastAlone ? "col-span-2" : item.className
                } rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid grid-cols-3 auto-rows-[140px] gap-6">
          {collageData.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setIndex(idx)}
              className={`${item.className} rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* MOBILE */}
        <div className="sm:hidden flex flex-col gap-3 px-3">
          {magazineBlocks.map((block, blockIdx) => {
            const big = block[0];
            const small1 = block[1];
            const small2 = block[2];
            const isFlipped = blockIdx % 2 === 1;

            return (
              <div key={blockIdx} className="flex flex-col gap-3">
                {blockIdx === 0 && (
                  <div className="flex items-center gap-2 px-1 mb-1">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                      Gallery
                    </span>
                    <span className="h-px flex-1 bg-gray-200" />
                  </div>
                )}

                {!small1 && !small2 ? (
                  <div
                    onClick={() =>
                      setIndex(
                        collageData.findIndex(
                          (i) => i.id === big.id
                        )
                      )
                    }
                    className="w-full rounded-2xl overflow-hidden cursor-pointer"
                    style={{ height: "220px" }}
                  >
                    <img
                      src={big.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex gap-3 ${
                      isFlipped ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      onClick={() =>
                        setIndex(
                          collageData.findIndex(
                            (i) => i.id === big.id
                          )
                        )
                      }
                      className="flex-[2] rounded-2xl overflow-hidden cursor-pointer"
                      style={{ height: "220px" }}
                    >
                      <img
                        src={big.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-[1] flex flex-col gap-3">
                      {small1 && (
                        <div
                          onClick={() =>
                            setIndex(
                              collageData.findIndex(
                                (i) => i.id === small1.id
                              )
                            )
                          }
                          className="flex-1 rounded-2xl overflow-hidden cursor-pointer"
                        >
                          <img
                            src={small1.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {small2 && (
                        <div
                          onClick={() =>
                            setIndex(
                              collageData.findIndex(
                                (i) => i.id === small2.id
                              )
                            )
                          }
                          className="flex-1 rounded-2xl overflow-hidden cursor-pointer"
                        >
                          <img
                            src={small2.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ LIGHTBOX (Library Controlled) */}
      <Lightbox
        open={index !== null}
        close={() => setIndex(null)}
        slides={images}
        index={index ?? 0}
      />
    </>
  );
}