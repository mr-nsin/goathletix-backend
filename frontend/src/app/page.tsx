"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MegaSearchBar } from "@/components/MegaSearchBar";
import { SectionSlider } from "@/components/SectionSlider";
import { DiscoveryCard } from "@/components/DiscoveryCard";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [competitionFilter, setCompetitionFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("Anywhere");
  const [whenFilter, setWhenFilter] = useState("Any Time");
  const [currentMonth, setCurrentMonth] = useState(9); // October 2026
  const [currentYear, setCurrentYear] = useState(2026);

  // When search or filter changes on the homepage, we could redirect to a search results page
  // For now, the user requested exact structural layout, so we focus on the portal UI.
  // In a full implementation, the MegaSearchBar would trigger a router.push('/search?...')

  return (
    <div className="bg-white min-h-screen">
      {/* Massive Hero Section */}
      <div className="relative h-[600px] md:h-[700px] w-full flex items-center justify-center overflow-hidden">
        {/* Stadium background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070&auto=format&fit=crop')" }}
        />
        {/* Subtle dark gradient overlay to make text readable */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-12 w-full max-w-[1600px] mx-auto pt-24 pb-12 flex flex-col items-center text-center">
          <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter mb-4 leading-[0.9] max-w-5xl">
            FIND YOUR FINISH LINE
          </h1>
          <p className="text-white font-sans text-lg md:text-xl max-w-2xl font-medium tracking-wide mb-12">
            Discover and track every race, marathon, and trek. All the events. All in one place.
          </p>
          
          <MegaSearchBar
            search={search}
            setSearch={setSearch}
            sportFilter={sportFilter}
            setSportFilter={setSportFilter}
            competitionFilter={competitionFilter}
            setCompetitionFilter={setCompetitionFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            whenFilter={whenFilter}
            setWhenFilter={setWhenFilter}
          />
        </div>
      </div>

      <div className="pt-12 pb-16 space-y-4">
        
        {/* Sports Section */}
        <SectionSlider 
          title="Sports" 
          actionText="View all sports"
          onActionClick={() => router.push('/sports')}
        >
          <DiscoveryCard 
            title="Running"
            subtitle="Marathons & Ultras"
            imageUrl="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/sports/running"
          />
          <DiscoveryCard 
            title="Cycling"
            subtitle="Road & MTB"
            imageUrl="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/sports/cycling"
          />
          <DiscoveryCard 
            title="Triathlon"
            subtitle="Ironman & Sprint"
            imageUrl="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/sports/triathlon"
          />
          <DiscoveryCard 
            title="Swimming"
            subtitle="Open Water"
            imageUrl="https://images.unsplash.com/photo-1519315901367-f34f927e268f?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/sports/swimming"
          />
          <DiscoveryCard 
            title="Trekking"
            subtitle="Hikes & Trails"
            imageUrl="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/sports/trekking"
          />
        </SectionSlider>

        {/* Major Events Section */}
        <SectionSlider 
          title="Major Events" 
          actionText="View all events"
          onActionClick={() => {}}
        >
          <DiscoveryCard 
            title="Tata Mumbai Marathon"
            subtitle="Jan 2027 • Mumbai"
            imageUrl="https://images.unsplash.com/photo-1530143311094-34d807799e8f?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/mumbai"
          />
          <DiscoveryCard 
            title="TCS World 10K"
            subtitle="May 2026 • Bengaluru"
            imageUrl="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/bengaluru"
          />
          <DiscoveryCard 
            title="Goa Ironman 70.3"
            subtitle="Oct 2026 • Goa"
            imageUrl="https://images.unsplash.com/photo-1521312563385-618a804791ea?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/goa"
          />
          <DiscoveryCard 
            title="Pune International Marathon"
            subtitle="Dec 2026 • Pune"
            imageUrl="https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/pune"
          />
        </SectionSlider>

        {/* Cities Section */}
        <SectionSlider 
          title="Cities" 
          actionText="View all locations"
          onActionClick={() => router.push('/locations')}
        >
          <DiscoveryCard 
            title="Bengaluru"
            subtitle="The Fitness Hub"
            imageUrl="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/bengaluru"
            aspectRatio="square"
          />
          <DiscoveryCard 
            title="Mumbai"
            subtitle="City of Marathons"
            imageUrl="https://images.unsplash.com/photo-1522439169608-f4ee8f399432?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/mumbai"
            aspectRatio="square"
          />
          <DiscoveryCard 
            title="Pune"
            subtitle="Trail & Road"
            imageUrl="https://images.unsplash.com/photo-1571439975765-f483c6b2ffb3?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/pune"
            aspectRatio="square"
          />
          <DiscoveryCard 
            title="New Delhi"
            subtitle="Capital Runs"
            imageUrl="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/new-delhi"
            aspectRatio="square"
          />
          <DiscoveryCard 
            title="Goa"
            subtitle="Swim, Bike, Run"
            imageUrl="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop"
            linkUrl="/locations/goa"
            aspectRatio="square"
          />
        </SectionSlider>

      </div>
    </div>
  );
}
