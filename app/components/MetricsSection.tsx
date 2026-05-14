import metricsData from "@/app/data/metrics.json";

export default function MetricsSection() {
  const metrics = metricsData.metrics.slice(0, 3);

  return (
    <section className="w-full bg-white border-y border-slate-100 py-3 sm:py-4">
      <div className="max-w-[900px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center
                bg-[#f8fffe] border border-[#00B8C6]/20 rounded-xl
                py-3 px-2 sm:py-4 sm:px-4
                hover:border-[#00B8C6]/50 hover:bg-[#f0fdfc]
                transition-all duration-200"
            >
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-[18px] sm:text-[26px] lg:text-[32px] font-extrabold text-[#00B8C6] leading-none">
                  {m.value}
                </span>
                <span className="text-[13px] sm:text-[18px] lg:text-[22px] font-bold text-[#00B8C6] leading-none">
                  {m.suffix}
                </span>
              </div>
              <p className="mt-1 text-[9px] sm:text-[11px] lg:text-[12px] text-slate-500 font-medium leading-tight">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}