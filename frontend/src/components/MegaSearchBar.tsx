import React from "react";
import { Search, MapPin, Activity, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface MegaSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  sportFilter: string;
  setSportFilter: (s: string) => void;
  locationFilter: string;
  setLocationFilter: (s: string) => void;
  currentMonth: number;
  setCurrentMonth: (m: number) => void;
  currentYear: number;
  setCurrentYear: (y: number) => void;
}

const ALL_SPORTS = ["All", "Running", "Cycling", "Trekking", "Triathlon", "Swimming"];
const ALL_LOCATIONS = ["All", "Bengaluru", "Mumbai", "Pune", "Goa", "New Delhi", "Ooty"];

export function MegaSearchBar({
  search,
  setSearch,
  sportFilter,
  setSportFilter,
  locationFilter,
  setLocationFilter,
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear,
}: MegaSearchBarProps) {
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-8 relative z-20">
      <div className="bg-white rounded-lg shadow-[0px_4px_20px_rgba(0,0,0,0.1)] border border-[#DBDBE7] p-2 flex flex-col md:flex-row items-center gap-2 md:gap-0">
        
        {/* Search Text */}
        <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#DBDBE7] w-full group">
          <Search className="w-5 h-5 text-[#737582] mr-3 group-focus-within:text-[#37DAC3] transition-colors" />
          <input
            type="text"
            placeholder="Search events, organizers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[#181427] font-sans text-sm font-bold placeholder-[#737582]"
          />
        </div>

        {/* Sport Select */}
        <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#DBDBE7] w-full">
          <Activity className="w-5 h-5 text-[#737582] mr-3" />
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full bg-transparent outline-none text-[#181427] font-sans text-sm font-bold uppercase cursor-pointer"
          >
            {ALL_SPORTS.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>

        {/* Location Select */}
        <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#DBDBE7] w-full">
          <MapPin className="w-5 h-5 text-[#737582] mr-3" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full bg-transparent outline-none text-[#181427] font-sans text-sm font-bold uppercase cursor-pointer"
          >
            {ALL_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Month Navigation */}
        <div className="flex-1 flex items-center justify-between px-4 py-2 w-full">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-[#737582] mr-3" />
            <span className="text-[#181427] font-sans text-sm font-bold uppercase">
              {monthNames[currentMonth]} {currentYear}
            </span>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={handlePrevMonth}
              className="p-1 hover:bg-[#F6F6F9] rounded text-[#141A3E] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1 hover:bg-[#F6F6F9] rounded text-[#141A3E] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
