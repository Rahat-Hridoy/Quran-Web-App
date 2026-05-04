"use client";

import { Search, Moon, Sun, Settings, Heart, Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useReaderSettings } from "@/context/ReaderSettingsContext";
import { useSearchParams } from "next/navigation";
import { fetchSurahById, Surah } from "@/lib/api";

export default function ReaderHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const searchParams = useSearchParams();
  const surahId = searchParams.get("surah") || "1";

  const { 
    arabicFontSize, setArabicFontSize, 
    translationFontSize, setTranslationFontSize, 
    arabicFont, setArabicFont 
  } = useReaderSettings();

  useEffect(() => {
    const getSurahInfo = async () => {
      const id = Number(surahId);
      if (isNaN(id)) return;
      
      try {
        const data = await fetchSurahById(id);
        setActiveSurah(data);
      } catch (error) {
        console.error("Failed to fetch surah info:", error);
      }
    };
    getSurahInfo();
  }, [surahId]);

  return (
    <header className="h-20 border-b border-border-subtle flex items-center justify-between px-10 bg-bg-main/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex flex-col">
          <h2 className="text-sm font-serif font-bold text-primary-gold uppercase tracking-[0.2em]">
            {activeSurah ? activeSurah.name_english : "Loading..."}
          </h2>
          <span className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">
            {activeSurah ? `${activeSurah.revelation_place} • ${activeSurah.total_ayahs} Ayahs` : "..."}
          </span>
        </div>

        <div className="hidden md:flex relative flex-1 max-w-md ml-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder={`Search within ${activeSurah?.name_english || 'this Surah'}...`}
            className="w-full bg-bg-sidebar/50 border border-border-subtle rounded-full py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary-green/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden lg:flex items-center gap-2 bg-primary-green/10 hover:bg-primary-green/20 text-primary-green px-4 py-2 rounded-full text-xs font-bold transition-all border border-primary-green/20">
          <Heart size={14} className="fill-primary-green animate-heartbeat" />
          Support Us
        </button>

        <div className="h-6 w-px bg-border-subtle mx-2" />

        <div className="flex items-center gap-1">
          <button className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <Sun size={20} />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <Settings size={20} />
          </button>
        </div>

        <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-green to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary-green/20 ml-2">
          RH
        </button>
      </div>

      {/* Settings Panel Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-sm h-full bg-bg-sidebar border-l border-border-subtle p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-bold font-serif text-primary-gold">Reader Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <span>Arabic Font Size</span>
                  <span className="text-primary-green">{arabicFontSize}px</span>
                </div>
                <input 
                  type="range" min="20" max="64" step="2"
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(Number(e.target.value))}
                  className="w-full accent-primary-green bg-bg-content h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <span>Translation Font Size</span>
                  <span className="text-primary-green">{translationFontSize}px</span>
                </div>
                <input 
                  type="range" min="12" max="32" step="1"
                  value={translationFontSize}
                  onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                  className="w-full accent-primary-green bg-bg-content h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block">Arabic Font</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Amiri", "KFGQ"] as const).map((font) => (
                    <button
                      key={font}
                      onClick={() => setArabicFont(font)}
                      className={`py-2 text-xs rounded-xl border transition-all ${
                        arabicFont === font 
                          ? "bg-primary-green/10 border-primary-green text-primary-green font-bold" 
                          : "bg-bg-content border-border-subtle text-text-secondary hover:border-white/20"
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-bg-main/50 rounded-2xl border border-border-subtle space-y-4">
                <p className="text-xs text-text-secondary/50 uppercase tracking-widest mb-2 text-center">Live Preview</p>
                <p 
                  className="text-right text-text-primary" 
                  style={{ fontSize: `${arabicFontSize}px`, fontFamily: arabicFont === "Amiri" ? "var(--font-amiri)" : "serif" }}
                  suppressHydrationWarning
                >
                  بِسْمِ اللَّهِ
                </p>
                <p 
                  className="text-text-secondary" 
                  style={{ fontSize: `${translationFontSize}px` }}
                  suppressHydrationWarning
                >
                  In the name of Allah...
                </p>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-primary-green hover:bg-primary-green/90 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-green/20 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
