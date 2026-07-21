import { EventsDirectory } from "@/components/EventsDirectory";

interface SportPageProps {
  params: {
    sport: string;
  };
}

const descriptions: Record<string, string> = {
  running: "The global running culture is thriving, with marathons, half-marathons, and fun runs bringing communities together in cities worldwide.",
  cycling: "From grueling mountain climbs to scenic coastal rides, cycling events offer challenges for riders of all skill levels.",
  trekking: "Explore the wilderness and conquer peaks with guided and competitive trekking events across the most beautiful landscapes.",
  triathlon: "Test your ultimate endurance with swim, bike, and run events. Triathlons are the pinnacle of multi-sport athleticism."
};

export default function SportDetail({ params }: SportPageProps) {
  const sportName = params.sport.charAt(0).toUpperCase() + params.sport.slice(1);
  const decodedSport = decodeURIComponent(sportName);
  const description = descriptions[params.sport.toLowerCase()] || `Discover and participate in ${sportName} events around the globe.`;

  return (
    <>
      <div className="bg-[#141A3E] text-white py-16 border-b-4 border-[#37DAC3]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tighter mb-4 shadow-sm">
            {decodedSport} Events
          </h1>
          <p className="text-xl md:text-2xl text-white font-sans opacity-90 max-w-3xl drop-shadow-md">
            Find all upcoming {decodedSport.toLowerCase()} events across the globe.
          </p>
        </div>
      </div>

      <EventsDirectory initialSportFilter={sportName} />
    </>
  );
}
