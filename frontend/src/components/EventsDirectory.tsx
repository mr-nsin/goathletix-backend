"use client";

import { useCallback, useEffect, useState } from "react";
import fallbackEvents from "@/lib/fallbackEvents.json";
import { MegaSearchBar } from "@/components/MegaSearchBar";
import { EventRow } from "@/components/EventRow";
import { NormalizedEvent, ApiEvent, normalizeEvent } from "@/types/events";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

const CITY_COORDINATES = [
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Goa", lat: 15.2993, lng: 74.1240 },
  { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Ooty", lat: 11.4102, lng: 76.6950 },
];

interface EventsDirectoryProps {
  initialSportFilter?: string;
  initialLocationFilter?: string;
}

export function EventsDirectory({ 
  initialSportFilter = "All", 
  initialLocationFilter = "All" 
}: EventsDirectoryProps) {
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState(initialSportFilter);
  const [locationFilter, setLocationFilter] = useState(initialLocationFilter);
  const [loading, setLoading] = useState(false);
  const [seasonPlan, setSeasonPlan] = useState<NormalizedEvent[]>([]);

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(9); // October 2026
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    // Only auto-locate if we don't have a specific initial location filter
    if (initialLocationFilter !== "All" || typeof window === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let nearestCity = CITY_COORDINATES[0];
        let minDistance = Infinity;

        for (const city of CITY_COORDINATES) {
          const dist = Math.sqrt(
            Math.pow(city.lat - latitude, 2) + Math.pow(city.lng - longitude, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearestCity = city;
          }
        }
        setLocationFilter(nearestCity.name);
      },
      () => { /* Ignore geolocation errors silently */ }
    );
  }, [initialLocationFilter]);

  const fetchEvents = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", "100");
      params.append("year", String(currentYear));
      params.append("month", String(currentMonth + 1));

      if (search) params.append("search", search);
      if (sportFilter && sportFilter !== "All") params.append("sport", sportFilter.toLowerCase());
      if (locationFilter && locationFilter !== "All") params.append("city", locationFilter);
      
      const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`, { signal });
      if (!response.ok) throw new Error("Backend response error");
      const result = await response.json();
      
      const backendEvents = result.data || result;
      if (Array.isArray(backendEvents)) {
        setEvents(backendEvents.map((event: ApiEvent) => normalizeEvent(event)));
      } else {
        setEvents([]);
      }
    } catch (error) {
      if (signal?.aborted) return;
      const normalizedFallback = fallbackEvents.map(normalizeEvent);
      const filtered = normalizedFallback.filter((e) => {
        const matchesSearch = !search || e.eventName.toLowerCase().includes(search.toLowerCase()) || e.organizerName.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase());
        const matchesSport = sportFilter === "All" || e.sportType.toLowerCase() === sportFilter.toLowerCase();
        const matchesLocation = locationFilter === "All" || e.city.toLowerCase().includes(locationFilter.toLowerCase()) || (locationFilter.toLowerCase() === "pune" && e.city.toLowerCase() === "mumbai");
        const [yearStr, monthStr] = e.eventDate.split("-");
        const matchesMonth = parseInt(monthStr) - 1 === currentMonth && parseInt(yearStr) === currentYear;

        return matchesSearch && matchesSport && matchesLocation && matchesMonth;
      });
      setEvents(filtered);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [currentMonth, currentYear, locationFilter, search, sportFilter]);

  useEffect(() => {
    const controller = new AbortController();
    const delayDebounceFn = setTimeout(() => {
      fetchEvents(controller.signal);
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [fetchEvents]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const toggleSeasonPlan = (e: NormalizedEvent) => {
    if (seasonPlan.some((item) => item.id === e.id)) {
      setSeasonPlan(seasonPlan.filter((item) => item.id !== e.id));
    } else {
      setSeasonPlan([...seasonPlan, e]);
    }
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  return (
    <div className="flex flex-col w-full">
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

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 mt-4">
        <div className="w-full bg-white border border-[#DBDBE7] min-h-[600px] flex flex-col shadow-sm">
          
          <div className="bg-[#141A3E] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DBDBE7]">
            <h2 className="font-heading font-bold text-lg uppercase tracking-wider m-0 leading-tight">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <span className="text-xs font-bold text-[#DBDBE7] uppercase tracking-widest mt-2 sm:mt-0">
              {sortedEvents.length} Events Found
            </span>
          </div>

          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-[#737582] font-bold uppercase tracking-widest p-12">
                Loading Events...
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#737582]">
                <span className="font-bold uppercase tracking-widest mb-4">No events match your criteria</span>
                <button
                  onClick={() => {
                    setSearch("");
                    setSportFilter(initialSportFilter);
                    setLocationFilter(initialLocationFilter);
                  }}
                  className="bg-[#37DAC3] text-[#181427] px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#3CEAD1] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              sortedEvents.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  isSelected={seasonPlan.some((item) => item.id === event.id)}
                  onTogglePlan={toggleSeasonPlan}
                />
              ))
            )}
          </div>
          
        </div>
      </div>

      {seasonPlan.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181427] text-white p-4 shadow-xl border border-[#37DAC3] cursor-pointer hover:bg-slate-900 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">My Plan</span>
            <span className="bg-[#37DAC3] text-[#181427] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {seasonPlan.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
