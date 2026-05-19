import type { Course, CourseStructure } from "@/features/courses/types/course";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads/")) return `${BACKEND}${src}`;
  return src;
}

function PhaseIcon({ icon, alt }: { icon: string | null; alt: string }) {
  const src = resolveImage(icon);
  if (!src) {
    return (
      <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={22} height={22} style={{ width: 22, height: 22 }} />
  );
}

function TickIcon() {
  return (
    <svg className="w-3 h-3 text-[#00B8C6] shrink-0 mt-[3px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function PhaseCard({ phase, index }: { phase: CourseStructure; index: number }) {
  return (
    <div>
      {/* Mobile */}
      <div className="relative bg-white border border-[#00B8C6] rounded-2xl p-5 overflow-hidden sm:hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#00B8C6] rounded-l-2xl" />
        <div className="flex items-center gap-3 mb-4 pl-2 pb-4 border-b border-[#E0E0E0]">
          <div className="w-12 h-12 rounded-[10px] bg-[#00B8C6] flex items-center justify-center shrink-0">
            <PhaseIcon icon={phase.icon} alt={phase.title} />
          </div>
          <div>
            <h3 className="text-[22px] leading-none font-medium text-[#2E2E2E]">
              Phase <span className="font-bold text-[#00B8C6]">{phase.phaseNumber}</span>
            </h3>
            <p className="text-[11px] uppercase tracking-wider font-medium text-[#888] mt-1">{phase.title}</p>
          </div>
        </div>
        <div className="flex flex-col gap-[10px] pl-2">
          {(phase.description ?? []).map((point, i) => (
            <div key={i} className="flex items-start gap-[10px]">
              <div className="w-[18px] h-[18px] rounded-full bg-[#E1F5EE] flex items-center justify-center shrink-0 mt-[2px]">
                <TickIcon />
              </div>
              <p className="text-[13px] text-[#464646] leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex flex-row items-center py-8 md:py-10 gap-0">
        <div className="flex flex-col items-center gap-2 shrink-0" style={{ width: "140px" }}>
          <div className="w-[56px] h-[56px] rounded-[10px] bg-[#00B8C6] flex items-center justify-center shrink-0">
            <PhaseIcon icon={phase.icon} alt={phase.title} />
          </div>
          <p className="text-[13px] text-[#464646] font-medium text-center leading-tight">{phase.title}</p>
        </div>

        <div className="shrink-0" style={{ width: "48px" }} />

        <div className="flex items-center shrink-0" style={{ width: "160px" }}>
          <h3 className="text-[28px] md:text-[32px] leading-[100%] whitespace-nowrap">
            <span className="font-medium text-[#2E2E2E]">Phase </span>
            <span className="font-bold text-[#00B8C6]">{phase.phaseNumber}</span>
          </h3>
        </div>

        <div className="shrink-0" style={{ width: "48px" }} />

        <div className="flex flex-col gap-[10px] flex-1">
          {(phase.description ?? []).map((point, i) => (
            <div key={i} className="flex items-start gap-[10px]">
              <TickIcon />
              <p className="text-[14px] text-[#464646] leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CourseStructureSection({ course }: { course: Course }) {
  const phases = course.courseStructure ?? [];

  if (phases.length === 0) return null;

  return (
    <section className="w-full bg-[#FDFDFD] px-4 sm:px-6 lg:px-8 py-12 md:py-16 pb-6 md:pb-8">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-center text-[28px] sm:text-[36px] md:text-[42px] leading-[100%] mb-10 md:mb-14">
          <span className="font-medium text-[#2E2E2E]">Course </span>
          <span className="font-bold text-[#2E2E2E]">Structure</span>
        </h2>

        {/* Mobile */}
        <div className="flex flex-col gap-4 sm:hidden">
          {phases.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden sm:flex flex-col">
          {phases.map((phase, index) => (
            <div key={phase.id}>
              <PhaseCard phase={phase} index={index} />
              {index < phases.length - 1 && <hr className="border-t border-[#E0E0E0]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
