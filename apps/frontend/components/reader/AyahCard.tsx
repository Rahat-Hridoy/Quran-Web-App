"use client";

import { useMemo } from "react";
import { Play, Pause, Bookmark, MoreHorizontal, BookOpen } from "lucide-react";
import { useReaderSettings } from "@/context/ReaderSettingsContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

interface AyahCardProps {
  ayah: {
    number: number;
    juz: number;
    arabic: string;
    translation_en: string;
    translation_bn: string;
    surahNumber: number;
  };
  surahName: string;
  totalAyahs: number;
}

export default function AyahCard({ ayah, surahName, totalAyahs }: AyahCardProps) {
  const {
    arabicFontSize,
    translationFontSize,
    arabicFont,
    translationLanguage,
    translator
  } = useReaderSettings();
  const {
    playAyah,
    isPlaying,
    isVisible,
    currentSurahNumber,
    currentAyahNumber,
    currentTime,
    duration,
    togglePlayPause,
  } = useAudioPlayer();

  // Is THIS specific ayah currently playing?
  const isThisPlaying =
    isPlaying &&
    currentSurahNumber === ayah.surahNumber &&
    currentAyahNumber === ayah.number;

  // Is this ayah the active one in the player (even if paused)?
  const isThisActive =
    isVisible &&
    currentSurahNumber === ayah.surahNumber &&
    currentAyahNumber === ayah.number;

  // Split Arabic text into words for word-by-word highlighting
  const arabicWords = useMemo(() => {
    return ayah.arabic.split(/\s+/).filter(Boolean);
  }, [ayah.arabic]);

  // Calculate which word index should be highlighted based on playback progress
  // Words up to this index (inclusive) are highlighted green
  const highlightedWordIndex = useMemo(() => {
    if (!isThisPlaying || !duration || duration === 0) return -1;
    const progress = currentTime / duration; // 0 to 1
    // Map progress to word index — proportional distribution
    const index = Math.floor(progress * arabicWords.length);
    return Math.min(index, arabicWords.length - 1);
  }, [isThisPlaying, currentTime, duration, arabicWords.length]);

  const handlePlay = () => {
    if (isThisActive) {
      // Toggle play/pause for the same ayah
      togglePlayPause();
    } else {
      // Play a new ayah
      playAyah(ayah.surahNumber, ayah.number, surahName, totalAyahs);
    }
  };

  return (
    <div
      id={`ayah-${ayah.number}`}
      className={`group flex border-b border-white/5 py-8 transition-all duration-300 ${
        isThisActive ? "bg-[#428038]/10 border-l-2 border-l-[#428038]" : ""
      }`}
    >
      {/* Left Action Bar */}
      <div className="w-24 flex flex-col items-center">
        <div className="text-[16px] font-bold text-[#428038] mb-8">
          {ayah.surahNumber}:{ayah.number}
        </div>

        <div className="flex flex-col gap-6">
          <button
            onClick={handlePlay}
            className={`transition-all hover:scale-110 ${
              isThisPlaying
                ? "text-[#428038]"
                : isThisActive
                ? "text-[#428038]/60"
                : "text-text-secondary/30 hover:text-white"
            }`}
            title={isThisPlaying ? "Pause" : "Play"}
          >
            {isThisPlaying ? (
              <Pause size={20} fill="currentColor" strokeWidth={1} />
            ) : (
              <Play size={20} fill={isThisActive ? "currentColor" : "none"} strokeWidth={1} />
            )}
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
            className="text-right leading-[2.4] selection:bg-[#428038]/30 font-medium"
            style={{
              direction: 'rtl',
              fontSize: `${arabicFontSize}px`,
              fontFamily: arabicFont === "Amiri" ? "var(--font-amiri)" : "serif"
            }}
            suppressHydrationWarning
          >
            {isThisPlaying || (isThisActive && highlightedWordIndex >= 0) ? (
              // Word-by-word rendering with highlight sync
              arabicWords.map((word, i) => (
                <span
                  key={i}
                  className="transition-colors duration-200"
                  style={{
                    color:
                      i <= highlightedWordIndex
                        ? "#428038"
                        : isThisActive
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(255,255,255,0.95)",
                  }}
                >
                  {word}
                  {i < arabicWords.length - 1 ? " " : ""}
                </span>
              ))
            ) : (
              // Default: single text block (no per-word rendering)
              <span
                className={`transition-colors duration-300 ${
                  isThisActive ? "text-[#428038]" : "text-white/95"
                }`}
              >
                {ayah.arabic}
              </span>
            )}
          </p>
        </div>

        {/* Translation Section */}
        <div className="space-y-8">
          {/* English Translation */}
          <div className="max-w-4xl">
            <span className="text-[10px] text-text-secondary/40 font-bold uppercase tracking-[0.15em] block mb-3">
              {translationLanguage === "english" ? translator : "অনুবাদ: হাফেজ মুফতী হাবীবুর রহমান"}
            </span>
            <p
              className="text-white/90 leading-relaxed font-normal"
              style={{ fontSize: `${translationFontSize}px` }}
              suppressHydrationWarning
            >
              {translationLanguage === "english" ? ayah.translation_en : ayah.translation_bn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
