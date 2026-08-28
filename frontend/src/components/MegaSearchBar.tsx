import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Trophy, Activity, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { AnimatePresence, motion } from "framer-motion";
import "react-day-picker/dist/style.css";

interface MegaSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  sportFilter: string;
  setSportFilter: (s: string) => void;
  competitionFilter: string;
  setCompetitionFilter: (s: string) => void;
  locationFilter: string;
  setLocationFilter: (s: string) => void;
  whenFilter: string;
  setWhenFilter: (s: string) => void;
}

const ALL_SPORTS = [
  { name: "Running", desc: "Marathons & Sprints", icon: <Activity className="w-5 h-5 text-[#222222]" /> },
  { name: "Cycling", desc: "Road & Mountain", icon: <Activity className="w-5 h-5 text-[#222222]" /> },
  { name: "Triathlon", desc: "Swim, Bike, Run", icon: <Activity className="w-5 h-5 text-[#222222]" /> },
  { name: "Swimming", desc: "Pool & Open Water", icon: <Activity className="w-5 h-5 text-[#222222]" /> },
];

const ALL_COMPETITIONS = ["Local", "National", "International", "Amateur", "Professional"];

const ALL_LOCATIONS = [
  { name: "Anywhere", desc: "Search all destinations", icon: <MapPin className="w-5 h-5 text-[#222222]" /> },
  { name: "Bengaluru, Karnataka", desc: "The Fitness Hub", icon: <MapPin className="w-5 h-5 text-[#222222]" /> },
  { name: "Mumbai, Maharashtra", desc: "City of Marathons", icon: <MapPin className="w-5 h-5 text-[#222222]" /> },
  { name: "Pune, Maharashtra", desc: "Trail & Road", icon: <MapPin className="w-5 h-5 text-[#222222]" /> },
  { name: "Goa", desc: "Swim, Bike, Run", icon: <MapPin className="w-5 h-5 text-[#222222]" /> },
];

type TabId = 'sport' | 'competition' | 'where' | 'when' | 'search' | null;

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MegaSearchBar({
  search,
  setSearch,
  sportFilter,
  setSportFilter,
  competitionFilter,
  setCompetitionFilter,
  locationFilter,
  setLocationFilter,
  whenFilter,
  setWhenFilter,
}: MegaSearchBarProps) {
  const [activeTab, setActiveTab] = useState<TabId>(null);
  const [hoverTab, setHoverTab] = useState<TabId>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<Record<string, HTMLDivElement | null>>({});
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activePillStyle, setActivePillStyle] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });

  // Update whenFilter string based on dateRange
  useEffect(() => {
    if (dateRange?.from) {
      if (dateRange.to) {
        setWhenFilter(`${formatDate(dateRange.from)} – ${formatDate(dateRange.to)}`);
      } else {
        setWhenFilter(formatDate(dateRange.from));
      }
    } else {
      setWhenFilter("Any Time");
    }
  }, [dateRange, setWhenFilter]);

  // Handle CSS-based sliding active pill animation
  useEffect(() => {
    if (activeTab && tabsRef.current[activeTab] && innerContainerRef.current) {
      const el = tabsRef.current[activeTab];
      const containerRect = innerContainerRef.current.getBoundingClientRect();
      const elRect = el!.getBoundingClientRect();
      setActivePillStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1,
      });
    } else {
      setActivePillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeTab]);

  // Handle outside click to close expansion
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const expandAndFocus = (tab: TabId) => {
    setActiveTab(tab);
  };

  const showDivider = (tabId: TabId) => {
    if (!activeTab && !hoverTab) return true;
    const isAdjacentActiveOrHovered = (left: TabId, right: TabId) => {
      return activeTab === left || activeTab === right || hoverTab === left || hoverTab === right;
    };
    if (tabId === 'sport' && isAdjacentActiveOrHovered('sport', 'competition')) return false;
    if (tabId === 'competition' && isAdjacentActiveOrHovered('competition', 'where')) return false;
    if (tabId === 'where' && isAdjacentActiveOrHovered('where', 'when')) return false;
    if (tabId === 'when' && isAdjacentActiveOrHovered('when', 'search')) return false;
    return true;
  };

  const clearFilter = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (type === 'sport') setSportFilter("All");
    if (type === 'comp') setCompetitionFilter("All");
    if (type === 'loc') setLocationFilter("Anywhere");
    if (type === 'when') { setDateRange(undefined); setWhenFilter("Any Time"); }
    if (type === 'search') setSearch("");
  };

  return (
    <>
      {/* Full Page Backdrop Overlay */}
      <AnimatePresence>
        {activeTab !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
            onClick={() => {
              setActiveTab(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="w-full relative z-30 font-sans flex justify-center" ref={containerRef}>
        <motion.div 
          layoutId="search-container"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-[1350px]"
          style={{ borderRadius: 9999 }}
        >
          <motion.div 
            ref={innerContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-row items-stretch rounded-full h-[66px] relative transition-colors duration-200 w-full ${
              activeTab ? 'bg-[#EBEBEB] border-transparent' : 'bg-white border border-[#DDDDDD] shadow-md'
            }`}
          >
              {/* Sliding Active Pill */}
              <div 
                className="absolute top-0 bottom-0 bg-white rounded-full shadow-[0px_6px_20px_rgba(0,0,0,0.15)] z-10 pointer-events-none"
                style={{
                  left: `${activePillStyle.left}px`,
                  width: `${activePillStyle.width}px`,
                  boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
                  transition: 'left 0.3s cubic-bezier(0.2, 0, 0, 1), width 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.2s ease',
                }}
              />

              {/* 1. Sport Tab */}
              <div 
                ref={(el) => { tabsRef.current['sport'] = el; }}
                onClick={() => setActiveTab('sport')}
                onMouseEnter={() => setHoverTab('sport')}
                onMouseLeave={() => setHoverTab(null)}
                className={`flex-[1.2] flex flex-col justify-center pl-8 pr-4 relative cursor-pointer text-left z-20 rounded-full transition-colors duration-200 overflow-hidden ${
                  hoverTab === 'sport' && activeTab !== 'sport' ? (activeTab ? 'bg-[#DDDDDD]' : 'bg-[#EBEBEB]') : 'bg-transparent'
                }`}
              >
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="w-full">
                  <label className="block text-[12px] font-bold text-[#222222] cursor-pointer tracking-wider mb-0.5">Sport</label>
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[14px] truncate ${sportFilter === 'All' ? 'text-[#717171] font-normal' : 'text-[#222222] font-semibold'}`}>
                      {sportFilter === 'All' ? 'Add sport' : sportFilter}
                    </span>
                    {sportFilter !== 'All' && activeTab === 'sport' && (
                      <button onClick={(e) => clearFilter(e, 'sport')} className="p-1 hover:bg-gray-100 rounded-full ml-1"><X className="w-4 h-4 text-gray-500" /></button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Divider */}
              <div className="flex items-center z-20">
                <div className={`w-[1px] h-8 bg-gray-300 transition-opacity duration-200 ${showDivider('sport') ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              {/* 2. Competition Tab */}
              <div 
                ref={(el) => { tabsRef.current['competition'] = el; }}
                onClick={() => setActiveTab('competition')}
                onMouseEnter={() => setHoverTab('competition')}
                onMouseLeave={() => setHoverTab(null)}
                className={`flex-[1.2] flex flex-col justify-center pl-6 pr-4 relative cursor-pointer text-left z-20 rounded-full transition-colors duration-200 overflow-hidden ${
                  hoverTab === 'competition' && activeTab !== 'competition' ? (activeTab ? 'bg-[#DDDDDD]' : 'bg-[#EBEBEB]') : 'bg-transparent'
                }`}
              >
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="w-full">
                  <label className="block text-[12px] font-bold text-[#222222] cursor-pointer tracking-wider mb-0.5">Competition</label>
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[14px] truncate ${competitionFilter === 'All' ? 'text-[#717171] font-normal' : 'text-[#222222] font-semibold'}`}>
                      {competitionFilter === 'All' ? 'Add level' : competitionFilter}
                    </span>
                    {competitionFilter !== 'All' && activeTab === 'competition' && (
                      <button onClick={(e) => clearFilter(e, 'comp')} className="p-1 hover:bg-gray-100 rounded-full ml-1"><X className="w-4 h-4 text-gray-500" /></button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Divider */}
              <div className="flex items-center z-20">
                <div className={`w-[1px] h-8 bg-gray-300 transition-opacity duration-200 ${showDivider('competition') ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              {/* 3. Where Tab */}
              <div 
                ref={(el) => { tabsRef.current['where'] = el; }}
                onClick={() => setActiveTab('where')}
                onMouseEnter={() => setHoverTab('where')}
                onMouseLeave={() => setHoverTab(null)}
                className={`flex-[1.2] flex flex-col justify-center pl-6 pr-4 relative cursor-pointer text-left z-20 rounded-full transition-colors duration-200 overflow-hidden ${
                  hoverTab === 'where' && activeTab !== 'where' ? (activeTab ? 'bg-[#DDDDDD]' : 'bg-[#EBEBEB]') : 'bg-transparent'
                }`}
              >
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} className="w-full">
                  <label className="block text-[12px] font-bold text-[#222222] cursor-pointer tracking-wider mb-0.5">Where</label>
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[14px] truncate ${locationFilter === 'Anywhere' ? 'text-[#717171] font-normal' : 'text-[#222222] font-semibold'}`}>
                      {locationFilter === 'Anywhere' ? 'Search destinations' : locationFilter}
                    </span>
                    {locationFilter !== 'Anywhere' && activeTab === 'where' && (
                      <button onClick={(e) => clearFilter(e, 'loc')} className="p-1 hover:bg-gray-100 rounded-full ml-1"><X className="w-4 h-4 text-gray-500" /></button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Divider */}
              <div className="flex items-center z-20">
                <div className={`w-[1px] h-8 bg-gray-300 transition-opacity duration-200 ${showDivider('where') ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              {/* 4. When Tab */}
              <div 
                ref={(el) => { tabsRef.current['when'] = el; }}
                onClick={() => setActiveTab('when')}
                onMouseEnter={() => setHoverTab('when')}
                onMouseLeave={() => setHoverTab(null)}
                className={`flex-[1.2] flex flex-col justify-center pl-6 pr-4 relative cursor-pointer text-left z-20 rounded-full transition-colors duration-200 overflow-hidden ${
                  hoverTab === 'when' && activeTab !== 'when' ? (activeTab ? 'bg-[#DDDDDD]' : 'bg-[#EBEBEB]') : 'bg-transparent'
                }`}
              >
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="w-full">
                  <label className="block text-[12px] font-bold text-[#222222] cursor-pointer tracking-wider mb-0.5">When</label>
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[14px] truncate ${whenFilter === 'Any Time' ? 'text-[#717171] font-normal' : 'text-[#222222] font-semibold'}`}>
                      {whenFilter === 'Any Time' ? 'Add dates' : whenFilter}
                    </span>
                    {whenFilter !== 'Any Time' && activeTab === 'when' && (
                      <button onClick={(e) => clearFilter(e, 'when')} className="p-1 hover:bg-gray-100 rounded-full ml-1"><X className="w-4 h-4 text-gray-500" /></button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Divider */}
              <div className="flex items-center z-20">
                <div className={`w-[1px] h-8 bg-gray-300 transition-opacity duration-200 ${showDivider('when') ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              {/* 5. Search Text Input / Action */}
              <div 
                ref={(el) => { tabsRef.current['search'] = el; }}
                onClick={() => setActiveTab('search')}
                onMouseEnter={() => setHoverTab('search')}
                onMouseLeave={() => setHoverTab(null)}
                className={`flex-[2] flex flex-row items-center justify-between pl-6 pr-2 relative cursor-text z-20 rounded-full transition-colors duration-200 overflow-hidden ${
                  hoverTab === 'search' && activeTab !== 'search' ? (activeTab ? 'bg-[#DDDDDD]' : 'bg-[#EBEBEB]') : 'bg-transparent'
                }`}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}
                  className="flex flex-col text-left flex-1 min-w-0 mr-2 justify-center h-full relative z-10 w-full"
                >
                  <label className="block text-[12px] font-bold text-[#222222] mb-0.5 tracking-wider">Search</label>
                  <div className="flex items-center justify-between w-full">
                    <input
                      type="text"
                      placeholder="Team, event, competition..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent outline-none text-[#222222] font-semibold text-[14px] placeholder-[#717171] font-normal truncate relative z-30"
                    />
                    {search !== '' && activeTab === 'search' && (
                      <button onClick={(e) => clearFilter(e, 'search')} className="p-1 hover:bg-gray-100 rounded-full z-30"><X className="w-4 h-4 text-gray-500" /></button>
                    )}
                  </div>
                </motion.div>
                
                <button 
                  className={`${activeTab === 'search' ? 'w-[110px]' : 'w-[48px]'} h-[48px] bg-[#FF385C] hover:bg-[#D90B38] transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] text-white rounded-full flex items-center justify-center shrink-0 ml-1 shadow-md z-30 relative`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Perform real search logic here in future
                    setActiveTab(null);
                  }}
                >
                  <Search className="w-[18px] h-[18px] text-white stroke-[3px]" />
                  {activeTab === 'search' && <span className="ml-2 font-bold text-[15px] whitespace-nowrap overflow-hidden">Search</span>}
                </button>
              </div>
            </motion.div>

          {/* Popovers with Animation */}
          <AnimatePresence>
            {activeTab === 'sport' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                className="absolute top-[80px] left-0 bg-white rounded-[32px] shadow-[0px_10px_30px_rgba(0,0,0,0.15)] p-6 w-[400px] border border-gray-200 z-40"
              >
                <div className="px-2 pt-2 pb-2">
                  <h3 className="text-[12px] font-bold text-[#222222] mb-4">Suggested sports</h3>
                  <div className="space-y-1">
                    {[
                      { icon: <div className="text-[20px]">⚽</div>, title: 'Football', subtitle: 'Global tournaments & local leagues' },
                      { icon: <div className="text-[20px]">🏀</div>, title: 'Basketball', subtitle: 'Pro & amateur hoops' },
                      { icon: <div className="text-[20px]">🎾</div>, title: 'Tennis', subtitle: 'Grand slams & open courts' },
                      { icon: <div className="text-[20px]">🏃</div>, title: 'Running', subtitle: 'Marathons & 5K races' },
                      { icon: <Search className="w-5 h-5 text-[#222222]" />, title: 'View all sports', subtitle: 'Browse 50+ categories' },
                    ].map((loc, i) => (
                      <div 
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setSportFilter(loc.title); setActiveTab('competition'); }}
                        className="flex items-center px-3 py-3 hover:bg-[#F7F7F7] rounded-xl cursor-pointer transition-colors duration-200"
                      >
                        <div className="w-12 h-12 bg-[#F1F1F1] rounded-xl flex items-center justify-center mr-4 shrink-0">
                          {loc.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[15px] font-semibold text-[#222222] leading-tight">{loc.title}</span>
                          <span className="text-[14px] text-[#717171] leading-tight mt-0.5">{loc.subtitle}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'competition' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                className="absolute top-[80px] left-[15%] bg-white rounded-[32px] shadow-[0px_10px_30px_rgba(0,0,0,0.15)] p-6 w-[350px] border border-gray-200 z-40"
              >
                <h3 className="text-[12px] font-bold text-[#222222] mb-4 px-2">Competition Level</h3>
                <div className="space-y-1">
                  {[
                    { title: 'Professional', subtitle: 'Top-tier events' },
                    { title: 'Amateur', subtitle: 'Local & regional' },
                    { title: 'Collegiate', subtitle: 'University tournaments' },
                    { title: 'Youth', subtitle: 'Under 18s & junior' },
                  ].map((comp, i) => (
                    <div 
                      key={i} 
                      onClick={(e) => { e.stopPropagation(); setCompetitionFilter(comp.title); setActiveTab('where'); }}
                      className="flex flex-col px-3 py-3 rounded-xl cursor-pointer hover:bg-[#F7F7F7] transition-colors"
                    >
                      <span className="text-[15px] text-[#222222] font-semibold leading-tight">{comp.title}</span>
                      <span className="text-[14px] text-[#717171] leading-tight mt-0.5">{comp.subtitle}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'where' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                className="absolute top-[80px] left-[30%] bg-white rounded-[32px] shadow-[0px_10px_30px_rgba(0,0,0,0.15)] p-6 w-[400px] border border-gray-200 z-40"
              >
                <div className="px-2 pt-2 pb-4">
                  <h3 className="text-[12px] font-bold text-[#222222] mb-4">Suggested destinations</h3>
                  <div className="space-y-1">
                    {ALL_LOCATIONS.map((loc) => (
                      <div 
                        key={loc.name} 
                        onClick={() => { setLocationFilter(loc.name); setActiveTab('when'); }}
                        className={`flex items-center p-3 rounded-2xl cursor-pointer hover:bg-[#F7F7F7] transition-colors`}
                      >
                        <div className="bg-[#EBEBEB] p-3 rounded-2xl mr-4 flex items-center justify-center w-12 h-12">
                          {loc.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[15px] text-[#222222] font-semibold">{loc.name}</span>
                          <span className="text-[13px] text-[#717171]">{loc.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'when' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                className="absolute top-[80px] left-[50%] -translate-x-1/2 bg-white rounded-[32px] shadow-[0px_10px_40px_rgba(0,0,0,0.15)] p-10 border border-gray-200 flex flex-col items-center min-w-[850px] overflow-hidden z-40"
              >
                <div className="flex bg-[#EBEBEB] p-1 rounded-full mb-8 w-fit">
                  <button className="bg-white shadow-sm text-[14px] font-semibold px-8 py-2.5 rounded-full text-[#222222]">Dates</button>
                  <button className="text-[#222222] text-[14px] font-semibold px-8 py-2.5 rounded-full hover:bg-[#DDDDDD] transition-colors">Flexible</button>
                </div>
                
                <div className="w-full flex justify-center">
                  <style>
                    {`
                      .rdp-day_range_middle {
                        background-color: #f7f7f7 !important;
                        color: #222222 !important;
                        border-radius: 0 !important;
                      }
                      .rdp-day_range_start {
                        background-color: #222222 !important;
                        color: white !important;
                        border-radius: 9999px 0 0 9999px !important;
                      }
                      .rdp-day_range_end {
                        background-color: #222222 !important;
                        color: white !important;
                        border-radius: 0 9999px 9999px 0 !important;
                      }
                      .rdp-day_range_start.rdp-day_range_end {
                        border-radius: 9999px !important;
                      }
                    `}
                  </style>
                  <DayPicker 
                    mode="range" 
                    selected={dateRange} 
                    onSelect={(d) => {
                      setDateRange(d);
                      if (d?.from && d?.to) {
                        setActiveTab('search');
                      }
                    }} 
                    numberOfMonths={2}
                    className="border-none font-sans" 
                    classNames={({
                      months: "flex flex-row space-x-16",
                      month: "space-y-6",
                      caption_label: "text-[16px] font-semibold text-[#222222]",
                      nav: "flex items-center absolute w-full justify-between -mx-2 top-2 z-10 pointer-events-none",
                      nav_button: "h-9 w-9 bg-transparent p-0 border border-[#DDDDDD] rounded-full flex justify-center items-center hover:shadow-md hover:border-black transition-all pointer-events-auto text-[#222222]",
                      nav_button_previous: "absolute left-0",
                      nav_button_next: "absolute right-0",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      head_cell: "text-[#717171] font-semibold text-[13px] w-12 h-12 flex items-center justify-center",
                      row: "flex w-full mt-1",
                      cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "h-12 w-12 p-0 font-medium hover:border hover:border-black rounded-full flex items-center justify-center transition-all m-[1px] text-[#222222] text-[15px]",
                      day_selected: "bg-[#222222] text-white hover:bg-[#222222] hover:text-white focus:bg-[#222222] focus:text-white font-semibold",
                      day_today: "font-black text-black",
                      day_outside: "text-gray-300 opacity-50",
                      day_disabled: "text-gray-300 opacity-50",
                      day_hidden: "invisible",
                    }) as any}
                  />
                </div>
                <div className="flex gap-3 mt-8 flex-wrap justify-center">
                   <button className="border border-[#DDDDDD] rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#222222] hover:border-black transition-colors">Exact dates</button>
                   <button className="border border-[#DDDDDD] rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#222222] hover:border-black transition-colors">± 1 day</button>
                   <button className="border border-[#DDDDDD] rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#222222] hover:border-black transition-colors">± 2 days</button>
                   <button className="border border-[#DDDDDD] rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#222222] hover:border-black transition-colors">± 3 days</button>
                   <button className="border border-[#DDDDDD] rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#222222] hover:border-black transition-colors">± 7 days</button>
                   <button className="border border-[#DDDDDD] rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#222222] hover:border-black transition-colors">± 14 days</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
