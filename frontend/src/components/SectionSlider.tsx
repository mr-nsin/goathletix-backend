"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionSliderProps {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
  children: React.ReactNode;
}

export function SectionSlider({ title, actionText, onActionClick, children }: SectionSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 border-b border-[#DBDBE7]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tighter text-[#181427]">
          {title}
        </h2>
        
        <div className="flex items-center gap-4">
          {actionText && onActionClick && (
            <button 
              onClick={onActionClick}
              className="hidden sm:block text-[#2055DC] hover:text-[#181427] font-bold text-xs uppercase tracking-widest transition-colors"
            >
              {actionText}
            </button>
          )}
          <div className="flex gap-2">
            <button 
              onClick={scrollLeft}
              className="p-1 border border-[#DBDBE7] rounded hover:bg-[#F6F6F9] text-[#181427] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-1 border border-[#DBDBE7] rounded hover:bg-[#F6F6F9] text-[#181427] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
      
      {/* Mobile action button */}
      {actionText && onActionClick && (
        <div className="mt-4 sm:hidden text-center border-t border-[#DBDBE7] pt-4">
          <button 
            onClick={onActionClick}
            className="text-[#2055DC] font-bold text-xs uppercase tracking-widest"
          >
            {actionText}
          </button>
        </div>
      )}
    </section>
  );
}
