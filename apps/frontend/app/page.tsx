import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const quickLinks = ["Al Mulk", "Yasin", "Al Kahf", "Al Ikhlas"];

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] overflow-hidden selection:bg-primary-green selection:text-white">
      <Navbar />

      {/* Background Lanterns (Decorations) */}
      <div className="absolute top-0 left-[10%] opacity-20 hidden md:block">
        <svg width="60" height="300" viewBox="0 0 60 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="0" x2="30" y2="180" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
          <path d="M30 180L20 195H40L30 180Z" fill="white"/>
          <rect x="18" y="195" width="24" height="40" rx="2" stroke="white" strokeWidth="1.5"/>
          <circle cx="30" cy="215" r="3" fill="white"/>
          <path d="M18 235L30 260L42 235H18Z" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="absolute top-0 left-[25%] opacity-10 hidden md:block">
        <svg width="40" height="200" viewBox="0 0 40 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="0" x2="20" y2="120" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
          <rect x="12" y="120" width="16" height="30" rx="2" stroke="white" strokeWidth="1"/>
          <path d="M12 150L20 170L28 150H12Z" stroke="white" strokeWidth="1"/>
        </svg>
      </div>
      
      <div className="absolute top-0 right-[10%] opacity-20 hidden md:block">
        <svg width="60" height="350" viewBox="0 0 60 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="0" x2="30" y2="220" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
          <path d="M30 220L20 235H40L30 220Z" fill="white"/>
          <rect x="18" y="235" width="24" height="40" rx="2" stroke="white" strokeWidth="1.5"/>
          <circle cx="30" cy="255" r="3" fill="white"/>
          <path d="M18 275L30 300L42 275H18Z" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="absolute top-0 right-[25%] opacity-10 hidden md:block">
        <svg width="40" height="250" viewBox="0 0 40 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="0" x2="20" y2="150" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
          <rect x="12" y="150" width="16" height="30" rx="2" stroke="white" strokeWidth="1"/>
          <path d="M12 180L20 200L28 180H12Z" stroke="white" strokeWidth="1"/>
        </svg>
      </div>

      <main className="relative z-10 pt-40 pb-64 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto">
        {/* Hero Branding */}
        <h1 className="text-[44px] md:text-[64px] font-banner font-medium text-[#C4C4C4] mb-12 tracking-tight drop-shadow-2xl">
          QURAN MAZID
        </h1>

        {/* Search Interface (Glassmorphism) */}
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-600 group-focus-within:text-primary-green transition-colors" />
          </div>
          <input
            type="text"
            placeholder="What do you want to read?"
            className="w-full bg-[#121212]/50 backdrop-blur-xl border border-white/5 rounded-full py-5 pl-16 pr-24 text-white focus:outline-none focus:ring-1 focus:ring-primary-green/30 focus:border-primary-green/40 transition-all placeholder:text-gray-600 shadow-2xl"
          />
          <div className="absolute inset-y-0 right-6 flex items-center">
            <span className="text-[10px] text-gray-500 bg-white/5 border border-white/5 px-2 py-1 rounded-md font-mono tracking-tighter uppercase">
              Ctrl+k
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {quickLinks.map((link) => (
            <button
              key={link}
              className="px-8 py-2.5 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-full text-sm font-medium transition-all border border-white/5 backdrop-blur-sm"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Daily Ayah Section */}
        <div className="mt-32 text-center max-w-3xl px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
            And worship your Lord until there comes to you the certainty (death).
          </p>
          <p className="mt-8 text-gray-500 font-medium tracking-widest text-xs uppercase opacity-60">
            [ Al Hijr : 99 ]
          </p>
        </div>
      </main>

      {/* Footer Silhouette */}
      <div className="fixed bottom-0 left-0 right-0 w-full h-[40vh] pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10" />
        <Image
          src="/mosque_silhouette.png"
          alt="Mosque Silhouette"
          fill
          className="object-bottom object-contain opacity-20 mix-blend-screen"
          priority
        />
      </div>
    </div>
  );
}
