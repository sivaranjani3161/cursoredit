import { eventsMap } from "@/app/data/events";
import { EventData } from "@/app/types/event";
import EventCarousel from "@/app/components/Gallery/EventCarousel";
import EventCollage from "@/app/components/Gallery/EventCollage";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = eventsMap[id as keyof typeof eventsMap] as EventData;

  if (!data) return <div className="p-10">Not Found</div>;

  return (
    <div className="py-10">

      <div className="max-w-[1180px] mx-auto px-6 lg:px-8">
        <EventCarousel images={data.carousel} />
      </div>

      {/* Title */}
     <div className="max-w-[1180px] mx-auto px-6 lg:px-8 text-center mt-8 md:mt-12">
  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug">
    {data.title}{" "}
    <span className="text-teal-500">{data.highlight}</span>
  </h1>
</div>
      {/* Collage */}
      <div className="max-w-[1180px] mx-auto px-6 lg:px-8">
        <EventCollage images={data.collage} />
      </div>

    </div>
  );
}