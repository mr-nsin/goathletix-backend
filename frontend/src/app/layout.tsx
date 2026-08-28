import type { Metadata } from "next";
import { Roboto_Condensed, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoAthletix - Event Discovery",
  description: "Find your next race",
};

import { MapPin, User, Menu } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoCondensed.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F6F6F9]">
        {/* Top Header (Transparent Overlay) */}
        <header className="absolute top-0 left-0 w-full z-50 text-white bg-gradient-to-b from-black/60 to-transparent">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                 <div className="bg-[#37DAC3] text-white font-black text-2xl leading-none flex items-center justify-center w-10 h-10 rounded-sm italic">G</div>
                 <span className="font-heading font-black text-xl md:text-2xl uppercase tracking-tighter leading-none flex flex-col">
                   <span>GO</span>
                   <span>ATHLETIX</span>
                 </span>
              </Link>
              
              {/* Location */}
              <div className="hidden md:flex items-center text-sm font-bold gap-1">
                <MapPin className="w-4 h-4 text-white" />
                <span>You are in: <span className="border-b border-dashed border-white cursor-pointer hover:text-[#37DAC3] transition-colors">Choose location</span></span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Navigation */}
              <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold uppercase tracking-wider">
                <Link href="/" className="hover:text-[#37DAC3] transition-colors pb-1 border-b-2 border-white">HOME</Link>
                <Link href="/explore" className="hover:text-[#37DAC3] transition-colors pb-1 border-b-2 border-transparent">EXPLORE</Link>
                <div className="flex items-center gap-1 cursor-pointer hover:text-[#37DAC3] transition-colors pb-1 border-b-2 border-transparent">
                  READ <span className="text-[10px]">▼</span>
                </div>
                <Link href="/forum" className="hover:text-[#37DAC3] transition-colors pb-1 border-b-2 border-transparent">FORUM</Link>
                <Link href="/about" className="hover:text-[#37DAC3] transition-colors pb-1 border-b-2 border-transparent">ABOUT</Link>
              </nav>
              
              {/* Log In Button */}
              <div className="flex items-center gap-4">
                 <button className="bg-white text-black text-sm font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 transition-colors">
                   <User className="w-4 h-4" />
                   LOG IN
                 </button>
                 <button className="lg:hidden"><Menu className="w-6 h-6" /></button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Utilitarian Footer */}
        <footer className="bg-[#141A3E] text-white py-12 border-t border-slate-800 mt-auto">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#737582]">
            <span>© 2026 GoAthletix</span>
            <span>Data Provider</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
