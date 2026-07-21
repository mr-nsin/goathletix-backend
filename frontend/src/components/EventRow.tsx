import React from "react";
import { ExternalLink, Plus, Minus, MapPin } from "lucide-react";
import { NormalizedEvent } from "@/types/events";

interface EventRowProps {
  event: NormalizedEvent;
  isSelected: boolean;
  onTogglePlan: (event: NormalizedEvent) => void;
}

export function EventRow({ event, isSelected, onTogglePlan }: EventRowProps) {
  const eventDate = new Date(event.eventDate);
  const dayName = eventDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const dayNumber = eventDate.getDate();
  const monthName = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <div className="flex items-stretch border-b border-[#DBDBE7] hover:bg-[#F6F6F9] transition-none group min-h-[4.5rem]">
      
      {/* Date Box (Fixture Calendar style) */}
      <div className="w-16 sm:w-20 shrink-0 bg-[#F6F6F9] border-r border-[#DBDBE7] flex flex-col items-center justify-center py-2 relative">
        {/* Optional colored left border indicator based on sport */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
          event.sportType.toLowerCase() === 'running' ? 'bg-[#37DAC3]' : 
          event.sportType.toLowerCase() === 'cycling' ? 'bg-[#2055DC]' : 
          'bg-slate-800'
        }`} />
        <span className="text-[10px] sm:text-xs font-bold text-[#737582] uppercase tracking-wider leading-none mb-1">
          {dayName}
        </span>
        <span className="text-xl sm:text-2xl font-bold text-[#181427] leading-none">
          {dayNumber}
        </span>
      </div>

      {/* Sport Badge / Time Placeholder */}
      <div className="w-14 sm:w-20 shrink-0 flex items-center justify-center border-r border-[#DBDBE7] px-2">
        <span className="text-[9px] sm:text-[10px] font-bold text-[#737582] uppercase tracking-widest text-center">
          {event.sportType}
        </span>
      </div>

      {/* Main Details (Event Name) */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 min-w-0 border-r border-[#DBDBE7]">
        <h3 className="text-[14px] sm:text-[16px] font-bold text-[#181427] group-hover:text-[#2055DC] hover:underline cursor-pointer truncate leading-tight">
          {event.eventName}
        </h3>
        <div className="flex items-center gap-1.5 mt-1 text-[#737582]">
           <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">
             {event.organizerName}
           </span>
           {event.distanceOptions.length > 0 && (
             <>
               <span className="text-[10px]">•</span>
               <span className="text-[10px] sm:text-xs font-medium text-[#2055DC] truncate">
                 {event.distanceOptions.join(', ')}
               </span>
             </>
           )}
        </div>
      </div>

      {/* Location */}
      <div className="hidden md:flex w-40 lg:w-48 shrink-0 flex-col justify-center px-4 py-2 border-r border-[#DBDBE7]">
        <div className="flex items-center gap-1 text-[#181427] font-medium text-xs sm:text-sm truncate">
          <MapPin className="w-3.5 h-3.5 text-[#737582] shrink-0" />
          <span className="truncate">{event.city}</span>
        </div>
        {(event.state || event.venue) && (
          <span className="text-[10px] sm:text-[11px] text-[#737582] mt-0.5 truncate pl-4.5">
             {event.venue ? `${event.venue}, ` : ''}{event.state}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="w-24 sm:w-32 shrink-0 flex flex-col sm:flex-row items-center justify-center gap-2 px-2 py-2">
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-1 bg-[#37DAC3] hover:bg-[#3CEAD1] text-[#181427] rounded text-[9px] sm:text-[10px] uppercase font-bold px-2 py-1.5 shadow-sm transition-colors"
        >
          <span>Tickets</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
        <button
          onClick={() => onTogglePlan(event)}
          className={`w-full sm:w-auto flex items-center justify-center gap-1 rounded text-[9px] sm:text-[10px] uppercase font-bold px-2 py-1.5 border transition-colors ${
            isSelected
              ? "bg-[#181427] text-white border-[#181427]"
              : "bg-white text-[#181427] border-[#DBDBE7] hover:bg-[#F6F6F9]"
          }`}
        >
          {isSelected ? <Minus className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
          <span className="hidden sm:inline">{isSelected ? "Remove" : "Add"}</span>
        </button>
      </div>

    </div>
  );
}
