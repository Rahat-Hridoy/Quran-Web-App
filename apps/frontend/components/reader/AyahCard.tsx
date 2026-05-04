"use client";

import { Play, Bookmark, MoreHorizontal, BookOpen } from "lucide-react";
import { useReaderSettings } from "@/context/ReaderSettingsContext";
import { getAudioUrl } from "@/lib/api";
import { useState, useRef } from "react";

interface AyahCardProps {
  ayah: {
    number: number;
    juz: number;
    arabic: string;
    translation_en: string;
    surahNumber: number;
  };
}

export default function AyahCard({ ayah }: AyahCardProps) {
  const { arabicFontSize, translationFontSize, arabicFont } = useReaderSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(getAudioUrl(ayah.surahNumber, ayah.number));
        audioRef.current.onended = () => setIsPlaying(false);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div id={`ayah-${ayah.number}`} className="group flex border-b border-white/5 py-12 transition-colors">
      {/* Left Action Bar */}
      <div className="w-24 flex flex-col items-center">
        <div className="text-[16px] font-bold text-[#428038] mb-8">
          {ayah.surahNumber}:{ayah.number}
        </div>

        <div className="flex flex-col gap-6">
          <button
            onClick={handlePlay}
            className={`transition-all hover:scale-110 ${isPlaying ? "text-[#428038]" : "text-text-secondary/30 hover:text-white"}`}
            title={isPlaying ? "Pause" : "Play"}
          >
            <Play size={20} fill={isPlaying ? "currentColor" : "none"} strokeWidth={1} />
          </button>
          <button className="text-text-secondary/30 hover:text-white transition-all hover:scale-110" title="Reading Mode">
            <BookOpen size={20} strokeWidth={1} />
          </button>
          <button className="text-text-secondary/30 hover:text-white transition-all hover:scale-110" title="Bookmark">
            <Bookmark size={20} strokeWidth={1} />
          </button>
          <button className="text-text-secondary/30 hover:text-white transition-all hover:scale-110" title="More">
            <MoreHorizontal size={20} strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pr-4">
        {/* Arabic Text Section */}
        <div className="w-full flex justify-end mb-10">
          <p
            className="text-right leading-[2.4] text-white/95 selection:bg-[#428038]/30 font-medium"
            style={{
              direction: 'rtl',
              fontSize: `${arabicFontSize}px`,
              fontFamily: arabicFont === "Amiri" ? "var(--font-amiri)" : "serif"
            }}
            suppressHydrationWarning
          >
            {ayah.arabic}
          </p>
        </div>

        {/* Translation Section */}
        <div className="space-y-8">
          {/* English Translation */}
          <div className="max-w-4xl">
            <span className="text-[10px] text-text-secondary/40 font-bold uppercase tracking-[0.15em] block mb-3">SAHEEH INTERNATIONAL</span>
            <p
              className="text-white/90 leading-relaxed font-normal"
              style={{ fontSize: `${translationFontSize}px` }}
              suppressHydrationWarning
            >
              {ayah.translation_en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
