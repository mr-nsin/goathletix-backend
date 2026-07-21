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

import { Activity, Menu } from "lucide-react";
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
        {/* Top Header (Dark) */}
        <header className="bg-[#141A3E] text-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
               <Activity className="w-5 h-5 text-[#37DAC3]" />
               <span className="font-heading font-bold text-xl uppercase tracking-wider">
                 GoAthletix
               </span>
            </Link>
            
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-[#DBDBE7]">
                <Link href="/" className="hover:text-white transition-colors text-white py-4">Events</Link>
                <Link href="/sports" className="hover:text-white transition-colors py-4">Sports</Link>
                <Link href="/locations" className="hover:text-white transition-colors py-4">Locations</Link>
              </nav>
              <div className="flex gap-4 items-center">
                 <button className="text-[#37DAC3] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Log In</button>
                 <button className="md:hidden"><Menu className="w-6 h-6" /></button>
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
