import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const quickLinks = ["Al Mulk", "Yasin", "Al Kahf", "Al Ikhlas"];

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] overflow-hidden selection:bg-primary-green selection:text-white">
      <Navbar />

      {/* Background Lanterns (Decorations) */}
      <div className="absolute top-20 left-10 md:left-20 opacity-20 hidden md:block">
        <svg width="60" height="200" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="0" x2="30" y2="120" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
          <rect x="20" y="120" width="20" height="40" rx="4" fill="white"/>
          <path d="M30 160L20 180H40L30 160Z" fill="white"/>
        </svg>
      </div>
      <div className="absolute top-20 right-10 md:right-20 opacity-20 hidden md:block">
        <svg width="60" height="250" viewBox="0 0 60 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="0" x2="30" y2="150" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
          <rect x="15" y="150" width="30" height="50" rx="4" fill="white"/>
          <path d="M30 200L15 230H45L30 200Z" fill="white"/>
        </svg>
      </div>

      <main className="relative z-10 pt-40 pb-64 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto">
        {/* Hero Branding */}
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-12 tracking-tight drop-shadow-2xl">
          QURAN MAZID
        </h1>

        {/* Search Interface (Glassmorphism) */}
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-primary-green transition-colors" />
          </div>
          <input
            type="text"
            placeholder="What do you want to read?"
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-full py-5 pl-16 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green/50 transition-all placeholder:text-gray-600 shadow-2xl"
          />
          <div className="absolute inset-y-0 right-6 flex items-center">
            <span className="text-[10px] text-gray-500 bg-white/5 border border-white/10 px-2 py-1 rounded-md font-mono tracking-tighter">
              Ctrl+k
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {quickLinks.map((link) => (
            <button
              key={link}
              className="px-8 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full text-sm font-medium transition-all border border-white/5 backdrop-blur-sm"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Daily Ayah Section */}
        <div className="mt-32 text-center max-w-3xl px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light italic">
            "And the criminals will see the Fire and will be certain that they are to fall therein. And they will not find from it a way elsewhere."
          </p>
          <p className="mt-8 text-primary-green font-bold tracking-[0.3em] text-sm uppercase opacity-80">
            [ Al Kahf : 53 ]
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
          className="object-bottom object-contain opacity-40 mix-blend-screen"
          priority
        />
      </div>
    </div>
  );
}
