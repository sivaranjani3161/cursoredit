import Image from "next/image";
import featuresData from "@/app/data/Coursefeaturesdata.json";

export default function CourseFeatures() {
  const { features } = featuresData;

  return (
    <section className="w-full bg-[#00B8C6] py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-[12px] flex flex-col items-center text-center px-6 py-8 w-full sm:w-[280px] md:w-[310px] lg:w-[336px] min-h-[280px] sm:min-h-[310px] lg:min-h-[333px] shadow-sm"
          >
            <div className="w-[56px] h-[56px] rounded-lg bg-[#00B8C6] flex items-center justify-center mb-5 flex-shrink-0">
              <div className="relative w-8 h-8">
                <Image
                  src={feature.icon}
                  alt={feature.iconAlt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Title — two lines from JSON */}
            <h3
              className="font-semibold text-[#2E2E2E] leading-[120%] tracking-normal mb-3 text-[18px] sm:text-[20px] md:text-[16px] lg:text-[22px] "
             
            >
              {feature.titleLine1}
              <br />
              {feature.titleLine2}
            </h3>

            {/* Description */}
            <p className="text-[#2E2E2E]/70 text-[14px] leading-relaxed font-normal">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}