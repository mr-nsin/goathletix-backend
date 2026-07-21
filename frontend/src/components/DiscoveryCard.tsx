import Link from "next/link";
import React from "react";

interface DiscoveryCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl: string;
  aspectRatio?: "square" | "landscape" | "portrait";
}

export function DiscoveryCard({ title, subtitle, imageUrl, linkUrl, aspectRatio = "landscape" }: DiscoveryCardProps) {
  
  const aspectClass = 
    aspectRatio === "square" ? "aspect-square" :
    aspectRatio === "portrait" ? "aspect-[3/4]" :
    "aspect-[4/3]";

  return (
    <Link href={linkUrl} className="group block flex-shrink-0 w-64 md:w-72 scroll-snap-align-start cursor-pointer">
      <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden mb-3 bg-[#DBDBE7] shadow-sm`}>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        {/* Subtle gradient overlay to make text pop if we ever place text over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="flex flex-col">
        <h3 className="text-[#181427] font-heading font-bold text-lg leading-tight uppercase tracking-wide group-hover:text-[#2055DC] transition-colors">
          {title}
        </h3>
        {subtitle && (
          <span className="text-[#737582] font-sans font-bold text-xs uppercase tracking-widest mt-1">
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}
