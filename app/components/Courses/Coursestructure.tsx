import Image from "next/image";
import data from "@/app/data/Coursestructuredata.json";

export default function CourseStructure() {
  const { sectionTitle, phases } = data;

  return (
<section className="w-full bg-[#FDFDFD] px-4 sm:px-6 lg:px-8 py-12 md:py-16 pb-6 md:pb-8">   
       <section className="w-full bg-[#FDFDFD] px-4 sm:px-6 lg:px-8 py-12 md:py-16 pb-6 md:pb-8"></section>
      <div className="max-w-[900px] mx-auto">

        <h2 className="text-center text-[28px] sm:text-[36px] md:text-[42px] leading-[100%] mb-10 md:mb-14">
          <span className="font-medium text-[#2E2E2E]">{sectionTitle.normal}</span>
          <span className="font-bold text-[#2E2E2E]">{sectionTitle.bold}</span>
        </h2>

        <div className="flex flex-col gap-4 sm:hidden">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="relative bg-white border border-[#00B8C6] rounded-2xl p-5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#00B8C6] rounded-l-2xl" />

              <div className="flex items-center gap-3 mb-4 pl-2 pb-4">
                <div className="w-12 h-12 rounded-[10px] bg-[#00B8C6] flex items-center justify-center shrink-0">
                  <Image
                    src={phase.icon}
                    alt={phase.iconAlt}
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />
                </div>
                <div>
                  <h3 className="text-[22px] leading-none">
                    <span className="font-medium text-[#2E2E2E]">{phase.phaseNormal}</span>
                    <span className="font-bold text-[#00B8C6]"> {phase.phaseBold}</span>
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider font-medium text-[#888] mb-[2px]">
                    {phase.label}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[10px] pl-2">
                {phase.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-[10px]">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#E1F5EE] flex items-center justify-center shrink-0 mt-[2px]">
                      <Image
                        src="/tick.png"
                        alt=""
                        width={10}
                        height={10}
                        style={{ width: "10px", height: "10px" }}
                      />
                    </div>
                    <p className="text-[13px] text-[#464646] leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLET & DESKTOP LAYOUT (sm and above) — your original code ── */}
        <div className="hidden sm:flex flex-col">
          {phases.map((phase, index) => (
            <div key={phase.id}>
              <div className="flex flex-row items-center py-8 md:py-10 gap-0">

                <div
                  className="flex flex-col items-center gap-2 shrink-0"
                  style={{ width: "140px" }}
                >
                  <div className="w-[56px] h-[56px] rounded-[10px] bg-[#00B8C6] flex items-center justify-center shrink-0">
                    <Image
                      src={phase.icon}
                      alt={phase.iconAlt}
                      width={28}
                      height={28}
                      style={{ width: "28px", height: "28px" }}
                    />
                  </div>
                  <p className="text-[13px] text-[#464646] font-medium text-center leading-tight">
                    {phase.label}
                  </p>
                </div>

                <div className="shrink-0" style={{ width: "48px" }} />

                <div className="flex items-center shrink-0" style={{ width: "160px" }}>
                  <h3 className="text-[28px] md:text-[32px] leading-[100%] whitespace-nowrap">
                    <span className="font-medium text-[#2E2E2E]">{phase.phaseNormal}</span>
                    <span className="font-bold text-[#00B8C6]">{phase.phaseBold}</span>
                  </h3>
                </div>

                <div className="shrink-0" style={{ width: "48px" }} />

                <div className="flex flex-col gap-[10px] flex-1">
                  {phase.points.map((point, i) => (
                    <div key={i} className="flex items-start gap-[10px]">
                      <Image
                        src="/tick.png"
                        alt=""
                        width={13}
                        height={13}
                        style={{ width: "13px", height: "13px", marginTop: "3px", flexShrink: 0 }}
                      />
                      <p className="text-[14px] text-[#464646] leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

              </div>
              {index < phases.length - 1 && (
                <hr className="border-t border-[#E0E0E0]" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}