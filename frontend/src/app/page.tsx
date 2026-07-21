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
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentMonth, setCurrentMonth] = useState(9); // October 2026
  const [currentYear, setCurrentYear] = useState(2026);

  // When search or filter changes on the homepage, we could redirect to a search results page
  // For now, the user requested exact structural layout, so we focus on the portal UI.
  // In a full implementation, the MegaSearchBar would trigger a router.push('/search?...')

  return (
    <div className="bg-white min-h-screen">
      {/* Massive Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-slate-900 w-full flex items-center justify-center overflow-hidden">
        {/* Placeholder background representing athletic events */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
          <h1 className="font-heading font-black text-5xl md:text-7xl text-white uppercase tracking-tighter mb-4 drop-shadow-lg max-w-4xl leading-none">
            The World's Athletic Events
          </h1>
          <p className="text-white font-sans font-bold text-lg md:text-xl uppercase tracking-widest drop-shadow opacity-90 max-w-2xl">
            Plan your sporting year with GoAthletix
          </p>
        </div>
      </div>

      <MegaSearchBar
        search={search}
        setSearch={setSearch}
        sportFilter={sportFilter}
        setSportFilter={setSportFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
      />

      <div className="pt-8 pb-16 space-y-4">
        
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
