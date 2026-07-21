import React from "react";
import Link from "next/link";

export interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

interface CategoryGridProps {
  title: string;
  items: CategoryItem[];
}

export function CategoryGrid({ title, items }: CategoryGridProps) {
  return (
    <div className="w-full bg-[#F6F6F9] min-h-[600px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-[#141A3E] uppercase tracking-wider mb-8 border-b-2 border-[#141A3E] pb-4 inline-block">
          {title}
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="group relative block overflow-hidden aspect-[4/3] bg-slate-900 border border-[#DBDBE7] hover:border-[#37DAC3] transition-colors">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-t from-[#141A3E]/80 to-transparent">
                <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-wider text-center group-hover:scale-110 transition-transform duration-300">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
