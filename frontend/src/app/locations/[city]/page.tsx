import { EventsDirectory } from "@/components/EventsDirectory";

interface LocationPageProps {
  params: {
    city: string;
  };
}

const descriptions: Record<string, string> = {
  bengaluru: "Known as the silicon valley of India, Bengaluru also boasts a massive running and cycling culture with year-round pleasant weather perfect for outdoor events.",
  mumbai: "The city that never sleeps has an active sports scene, famous for the Mumbai Marathon and coastal cycling routes.",
  pune: "With its hilly terrain and youthful demographic, Pune is a hotspot for trekking, trail running, and endurance sports.",
  goa: "Famous for its beaches, Goa is increasingly becoming a destination for triathlons, ironman events, and scenic marathons.",
  "new-delhi": "The capital city hosts massive sporting events with excellent infrastructure, though runners often brave extreme weather conditions.",
  ooty: "A paradise for high-altitude training and breathtaking trail runs amidst the Nilgiri hills."
};

export default function LocationDetail({ params }: LocationPageProps) {
  // Format "new-delhi" to "New Delhi"
  const formattedCity = params.city
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const decodedCity = formattedCity;

  const description = descriptions[params.city.toLowerCase()] || `Discover athletic events and fixtures in ${formattedCity}.`;

  return (
    <>
      <div className="bg-[#141A3E] text-white py-16 border-b-4 border-[#37DAC3]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tighter mb-4 shadow-sm">
          Events in {decodedCity}
        </h1>
        <p className="text-xl md:text-2xl text-white font-sans opacity-90 max-w-3xl drop-shadow-md">
          Find all upcoming events happening in {decodedCity}.
        </p>
        </div>
      </div>

      <EventsDirectory initialLocationFilter={formattedCity} />
    </>
  );
}
