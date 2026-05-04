"use client";

import { Play, Bookmark, MoreHorizontal, BookOpen, Share2 } from "lucide-react";
import { useReaderSettings } from "@/context/ReaderSettingsContext";
import { getAudioUrl } from "@/lib/api";
import { useState, useRef } from "react";

interface AyahCardProps {
  ayah: {
    number: number;
    juz: number;
    arabic: string;
    translation_en: string;
    translation_bn: string;
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
    <div className="group relative bg-bg-content/40 hover:bg-bg-content/60 border border-border-subtle hover:border-primary-green/30 rounded-2xl transition-all duration-300 flex min-h-[180px] overflow-hidden shadow-sm">
      {/* Left Action Bar */}
      <div className="w-16 bg-bg-sidebar/40 border-r border-border-subtle flex flex-col items-center py-6 gap-5">
        <div className="text-[10px] font-mono font-bold text-primary-gold bg-primary-gold/10 px-2 py-1 rounded">
          {ayah.juz}:{ayah.number}
        </div>
        
        <div className="flex flex-col gap-3 mt-2">
          <button 
            onClick={handlePlay}
            className={`p-2 rounded-lg transition-all ${isPlaying ? "text-primary-green bg-primary-green/20 scale-110" : "text-text-secondary hover:text-primary-green hover:bg-primary-green/10"}`} 
            title={isPlaying ? "Pause" : "Play"}
          >
            <Play size={18} fill={isPlaying ? "currentColor" : "none"} strokeWidth={isPlaying ? 0 : 2} />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary-green hover:bg-primary-green/10 rounded-lg transition-all" title="Tafsir">
            <BookOpen size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary-green hover:bg-primary-green/10 rounded-lg transition-all" title="Bookmark">
            <Bookmark size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary-green hover:bg-primary-green/10 rounded-lg transition-all" title="Share">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary-green hover:bg-primary-green/10 rounded-lg transition-all" title="More">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div className="w-full mb-8">
          <p 
            className="leading-[2] text-text-primary text-right dir-rtl drop-shadow-sm group-hover:text-primary-gold/90 transition-colors duration-500"
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

        <div className="space-y-4">
          {/* English Translation */}
          <div className="border-l-2 border-primary-green/20 pl-4">
            <span className="text-[10px] text-primary-green/40 font-bold uppercase tracking-widest block mb-1">English</span>
            <p 
              className="text-text-secondary leading-relaxed font-light group-hover:text-text-primary transition-colors duration-500 max-w-3xl"
              style={{ fontSize: `${translationFontSize}px` }}
              suppressHydrationWarning
            >
              {ayah.translation_en}
            </p>
          </div>

          {/* Bangla Translation */}
          <div className="border-l-2 border-primary-gold/20 pl-4">
            <span className="text-[10px] text-primary-gold/40 font-bold uppercase tracking-widest block mb-1">Bangla</span>
            <p 
              className="text-text-secondary leading-relaxed font-light group-hover:text-text-primary transition-colors duration-500 max-w-3xl"
              style={{ fontSize: `${translationFontSize}px` }}
              suppressHydrationWarning
            >
              {ayah.translation_bn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
