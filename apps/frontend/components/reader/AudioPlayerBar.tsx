"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  MoreVertical,
  Check,
} from "lucide-react";
import {
  useAudioPlayer,
  RECITERS,
  ReciterId,
} from "@/context/AudioPlayerContext";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayerBar() {
  const {
    isVisible,
    isPlaying,
    currentSurahNumber,
    currentAyahNumber,
    surahName,
    totalAyahs,
    currentTime,
    duration,
    reciterId,
    surahElapsedTime,
    estimatedSurahDuration,
    togglePlayPause,
    seekTo,
    nextAyah,
    prevAyah,
    closePlayer,
    setReciter,
  } = useAudioPlayer();

  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowReciterMenu(false);
      }
    };
    if (showReciterMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReciterMenu]);

  // Handle seek bar interaction
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current || !duration) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(ratio * duration);
  };

  const handleSeekMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!seekBarRef.current || !duration) return;
      const rect = seekBarRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seekTo(ratio * duration);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration, seekTo]);

  const progress = estimatedSurahDuration > 0 ? (surahElapsedTime / estimatedSurahDuration) * 100 : 0;

  if (!isVisible) return null;

  return (
    <div
      id="audio-player-bar"
      className="fixed bottom-0 left-0 right-0 z-[200] select-none"
    >
      {/* Progress Seek Bar — sits directly above the bar */}
      <div
        ref={seekBarRef}
        className="group/seek relative w-full h-[3px] hover:h-[5px] transition-all cursor-pointer bg-white/10"
        onMouseDown={handleSeekMouseDown}
      >
        {/* Buffered / progress track */}
        <div
          className="absolute top-0 left-0 h-full bg-[#428038] transition-[width] duration-100 ease-linear rounded-r-full"
          style={{ width: `${progress}%` }}
        />
        {/* Seek thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#428038] rounded-full shadow-lg shadow-[#428038]/40 opacity-0 group-hover/seek:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Main Bar — 3-column grid for perfect centering */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[56px] bg-[#141414]/95 backdrop-blur-xl border-t border-white/5 px-4 sm:px-6">
        {/* Left Section: Surah Info */}
        <div className="flex items-center gap-3 min-w-0 justify-self-start">
          {/* Green accent bar */}
          <div className="w-[3px] h-8 bg-[#428038] rounded-full shrink-0" />
          <div className="min-w-0">
            <p className="text-white text-[13px] font-semibold truncate leading-tight">
              {surahName}
            </p>
            <p className="text-white/40 text-[11px] font-medium mt-0.5 leading-tight">
              Ayah {currentAyahNumber} of {totalAyahs}
            </p>
          </div>
        </div>

        {/* Center Section: Controls — always perfectly centered */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Surah Elapsed Time */}
          <span className="text-white/40 text-[12px] font-mono tabular-nums w-[42px] text-right hidden sm:inline-block">
            {formatTime(surahElapsedTime)}
          </span>

          {/* Reciter Menu (three-dot) */}
          <div className="relative" ref={menuRef}>
            <button
              id="reciter-menu-btn"
              onClick={() => setShowReciterMenu(!showReciterMenu)}
              className="p-2 text-white/40 hover:text-white/80 transition-colors rounded-full hover:bg-white/5"
              title="Select Reciter"
            >
              <MoreVertical size={18} />
            </button>

            {/* Reciter Dropdown */}
            {showReciterMenu && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[280px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-[11px] text-white/40 uppercase tracking-[0.15em] font-bold">
                    Select Reciter
                  </p>
                </div>
                <div className="py-1 max-h-[240px] overflow-y-auto custom-scrollbar">
                  {RECITERS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setReciter(r.id);
                        setShowReciterMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${reciterId === r.id
                        ? "bg-[#428038]/10 text-[#428038]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${reciterId === r.id
                          ? "border-[#428038] bg-[#428038]"
                          : "border-white/20"
                          }`}
                      >
                        {reciterId === r.id && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium truncate">
                          {r.name}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {r.quality}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Previous Ayah */}
          <button
            id="audio-prev-btn"
            onClick={prevAyah}
            className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5 disabled:opacity-30"
            title="Previous Ayah"
            disabled={currentAyahNumber <= 1}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play/Pause */}
          <button
            id="audio-play-pause-btn"
            onClick={togglePlayPause}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#428038] hover:bg-[#4d9641] text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#428038]/30"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Next Ayah */}
          <button
            id="audio-next-btn"
            onClick={nextAyah}
            className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5 disabled:opacity-30"
            title="Next Ayah"
            disabled={currentAyahNumber >= totalAyahs}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Close */}
          <button
            id="audio-close-btn"
            onClick={closePlayer}
            className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
            title="Close Player"
          >
            <X size={18} />
          </button>

          {/* Estimated Surah Total Duration */}
          <span className="text-white/40 text-[12px] font-mono tabular-nums w-[42px] hidden sm:inline-block">
            {formatTime(estimatedSurahDuration)}
          </span>
        </div>

        {/* Right Section: Mobile time / spacer */}
        <div className="flex items-center gap-2 justify-self-end text-white/40 text-[11px] font-mono tabular-nums">
          <span className="sm:hidden">{formatTime(surahElapsedTime)}</span>
          <span className="sm:hidden">/</span>
          <span className="sm:hidden">{formatTime(estimatedSurahDuration)}</span>
        </div>
      </div>
    </div>
  );
}
