"use client";

import { Search, Moon, Sun, Settings, Heart, Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useReaderSettings } from "@/context/ReaderSettingsContext";
import { useSearchParams } from "next/navigation";
import { fetchSurahById, Surah } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

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
    <header className="h-[59px] border-b border-white/5 flex items-center justify-between px-6 bg-bg-main sticky top-0 z-50">
      {/* Left: Branding */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
          Quran Mazid
        </h1>
        <p className="text-[11px] text-text-secondary/60 font-medium mt-0.5">
          Read, Study, and Learn The Quran
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <div className="group relative">
            <button className="w-10 h-10 flex items-center justify-center text-primary-green/60 hover:text-primary-green hover:bg-primary-green/5 rounded-full transition-all duration-300">
              <div
                className="w-[18px] h-[18px] bg-current"
                style={{
                  maskImage: 'url(/icons/search.svg)',
                  WebkitMaskImage: 'url(/icons/search.svg)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </button>
            <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-4 py-2 bg-[#CCCCCC] text-[#222222] text-[13px] font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-[60] shadow-2xl translate-y-2 group-hover:translate-y-0">
              Search
            </div>
          </div>

          {/* Theme */}
          <div className="group relative">
            <button className="w-10 h-10 flex items-center justify-center text-primary-green/60 hover:text-primary-green hover:bg-primary-green/5 rounded-full transition-all duration-300">
              <div
                className="w-[18px] h-[18px] bg-current"
                style={{
                  maskImage: 'url(/icons/theme.svg)',
                  WebkitMaskImage: 'url(/icons/theme.svg)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </button>
            <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-4 py-2 bg-[#CCCCCC] text-[#222222] text-[13px] font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-[60] shadow-2xl translate-y-2 group-hover:translate-y-0">
              Theme
            </div>
          </div>

          {/* Settings */}
          <div className="group relative">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-primary-green/60 hover:text-primary-green hover:bg-primary-green/5 rounded-full transition-all duration-300"
            >
              <div
                className="w-[18px] h-[18px] bg-current"
                style={{
                  maskImage: 'url(/icons/setting.svg)',
                  WebkitMaskImage: 'url(/icons/setting.svg)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </button>
            <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-4 py-2 bg-[#CCCCCC] text-[#222222] text-[13px] font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-[60] shadow-2xl translate-y-2 group-hover:translate-y-0">
              Settings
            </div>
          </div>
        </div>

        <a
          href="#"
          className="flex h-[38px] min-w-[136px] select-none items-center justify-center gap-2 rounded-full bg-[#428038] px-2 text-[14px] font-bold text-white transition-all hover:bg-[#4c9141] active:scale-95 shadow-sm ml-2"
        >
          <span className="leading-0">Support Us</span>
          <div
            className="bg-white transition-all duration-300"
            style={{
              width: '19px',
              height: '18px',
              maskImage: 'url(/icons/heart.svg)',
              WebkitMaskImage: 'url(/icons/heart.svg)',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          />
        </a>
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
                      className={`py-2 text-xs rounded-xl border transition-all ${arabicFont === font
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
