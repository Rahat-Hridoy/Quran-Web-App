"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { getAudioUrl } from "@/lib/api";

// Available reciters
export const RECITERS = [
  { id: "Alafasy_128kbps", name: "Mishary Rashid Alafasy", quality: "128kbps" },
  { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit (Murattal)", quality: "192kbps" },
  { id: "Husary_128kbps", name: "Mahmoud Khalil Al-Husary", quality: "128kbps" },
  { id: "Minshawy_Murattal_128kbps", name: "Mohamed Siddiq Al-Minshawi", quality: "128kbps" },
  { id: "Saood_ash-Shuraym_128kbps", name: "Saud Al-Shuraim", quality: "128kbps" },
] as const;

export type ReciterId = (typeof RECITERS)[number]["id"];

interface AudioPlayerState {
  isVisible: boolean;
  isPlaying: boolean;
  currentSurahNumber: number;
  currentAyahNumber: number;
  surahName: string;
  totalAyahs: number;
  currentTime: number;
  duration: number;
  reciterId: ReciterId;
  // Accumulated duration from all previously completed ayahs in this surah
  accumulatedDuration: number;
  // Estimated total surah duration (based on average ayah duration)
  estimatedSurahDuration: number;
}

interface AudioPlayerContextType extends AudioPlayerState {
  playAyah: (surahNumber: number, ayahNumber: number, surahName: string, totalAyahs: number) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  nextAyah: () => void;
  prevAyah: () => void;
  closePlayer: () => void;
  setReciter: (id: ReciterId) => void;
  // Computed values for surah-level progress
  surahElapsedTime: number;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Track durations of each ayah we've seen (for accurate total calculation)
  const ayahDurationsRef = useRef<Map<string, number>>(new Map());

  const [state, setState] = useState<AudioPlayerState>({
    isVisible: false,
    isPlaying: false,
    currentSurahNumber: 1,
    currentAyahNumber: 1,
    surahName: "",
    totalAyahs: 7,
    currentTime: 0,
    duration: 0,
    reciterId: "Alafasy_128kbps",
    accumulatedDuration: 0,
    estimatedSurahDuration: 0,
  });

  // Build audio URL with selected reciter
  const buildAudioUrl = useCallback(
    (surahNumber: number, ayahNumber: number, reciterId: ReciterId) => {
      const s = surahNumber.toString().padStart(3, "0");
      const a = ayahNumber.toString().padStart(3, "0");
      return `https://everyayah.com/data/${reciterId}/${s}${a}.mp3`;
    },
    []
  );

  // Helper: compute estimated total surah duration from known ayah durations
  const computeEstimatedTotal = useCallback(
    (surahNumber: number, totalAyahs: number) => {
      const knownDurations: number[] = [];
      ayahDurationsRef.current.forEach((dur, key) => {
        if (key.startsWith(`${surahNumber}:`)) {
          knownDurations.push(dur);
        }
      });
      if (knownDurations.length === 0) return 0;
      const avgDuration = knownDurations.reduce((a, b) => a + b, 0) / knownDurations.length;
      return avgDuration * totalAyahs;
    },
    []
  );

  // Compute accumulated duration for ayahs before the current one
  const computeAccumulated = useCallback(
    (surahNumber: number, currentAyahNumber: number) => {
      let total = 0;
      for (let i = 1; i < currentAyahNumber; i++) {
        const key = `${surahNumber}:${i}`;
        total += ayahDurationsRef.current.get(key) || 0;
      }
      return total;
    },
    []
  );

  // Load and play an ayah
  const loadAndPlay = useCallback(
    (surahNumber: number, ayahNumber: number, reciterId: ReciterId) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }

      const audio = new Audio(buildAudioUrl(surahNumber, ayahNumber, reciterId));
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        const key = `${surahNumber}:${ayahNumber}`;
        ayahDurationsRef.current.set(key, audio.duration);
        setState((prev) => {
          // Lock estimated duration based on the first ayah so it NEVER changes during playback
          let newEstimated = prev.estimatedSurahDuration;
          if (newEstimated === 0 || isNaN(newEstimated)) {
            newEstimated = audio.duration * prev.totalAyahs;
          }
          
          return {
            ...prev,
            duration: audio.duration,
            accumulatedDuration: computeAccumulated(surahNumber, ayahNumber),
            estimatedSurahDuration: newEstimated,
          };
        });
      });

      audio.addEventListener("timeupdate", () => {
        setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
      });

      audio.addEventListener("ended", () => {
        // Auto-advance to next ayah (continuous playback)
        setState((prev) => {
          if (prev.currentAyahNumber < prev.totalAyahs) {
            const nextAyahNum = prev.currentAyahNumber + 1;
            const newAccumulated = computeAccumulated(prev.currentSurahNumber, nextAyahNum);
            // Defer load to avoid state update conflicts
            setTimeout(() => {
              loadAndPlay(prev.currentSurahNumber, nextAyahNum, prev.reciterId);
              setState((p) => ({
                ...p,
                currentAyahNumber: nextAyahNum,
                isPlaying: true,
                accumulatedDuration: newAccumulated,
              }));
            }, 0);
            return prev;
          } else {
            // Reached end of surah - keep progress at 100%
            return { ...prev, isPlaying: false, currentTime: prev.duration };
          }
        });
      });

      audio.play().catch(console.error);
    },
    [buildAudioUrl, computeAccumulated, computeEstimatedTotal]
  );

  const playAyah = useCallback(
    (surahNumber: number, ayahNumber: number, surahName: string, totalAyahs: number) => {
      // If switching surah, clear the duration cache
      setState((prev) => {
        if (prev.currentSurahNumber !== surahNumber) {
          ayahDurationsRef.current.clear();
        }
        return {
          ...prev,
          isVisible: true,
          isPlaying: true,
          currentSurahNumber: surahNumber,
          currentAyahNumber: ayahNumber,
          surahName,
          totalAyahs,
          currentTime: 0,
          duration: 0,
          accumulatedDuration: 0,
          estimatedSurahDuration: 0,
        };
      });
      loadAndPlay(surahNumber, ayahNumber, state.reciterId);
    },
    [loadAndPlay, state.reciterId]
  );

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (state.isPlaying) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      // If the surah is completely finished (last ayah and time is at the end), restart the surah
      if (
        state.currentAyahNumber === state.totalAyahs &&
        state.currentTime >= state.duration &&
        state.duration > 0
      ) {
        playAyah(state.currentSurahNumber, 1, state.surahName, state.totalAyahs);
        return;
      }
      audioRef.current.play().catch(console.error);
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [state, playAyah]);

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const nextAyah = useCallback(() => {
    setState((prev) => {
      if (prev.currentAyahNumber < prev.totalAyahs) {
        const next = prev.currentAyahNumber + 1;
        loadAndPlay(prev.currentSurahNumber, next, prev.reciterId);
        const newAccumulated = computeAccumulated(prev.currentSurahNumber, next);
        return { ...prev, currentAyahNumber: next, isPlaying: true, currentTime: 0, duration: 0, accumulatedDuration: newAccumulated };
      }
      return prev;
    });
  }, [loadAndPlay, computeAccumulated]);

  const prevAyah = useCallback(() => {
    setState((prev) => {
      if (prev.currentAyahNumber > 1) {
        const previous = prev.currentAyahNumber - 1;
        loadAndPlay(prev.currentSurahNumber, previous, prev.reciterId);
        const newAccumulated = computeAccumulated(prev.currentSurahNumber, previous);
        return { ...prev, currentAyahNumber: previous, isPlaying: true, currentTime: 0, duration: 0, accumulatedDuration: newAccumulated };
      } else {
        // Restart current ayah
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
        return { ...prev, currentTime: 0, isPlaying: true };
      }
    });
  }, [loadAndPlay, computeAccumulated]);

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      audioRef.current = null;
    }
    ayahDurationsRef.current.clear();
    setState((prev) => ({
      ...prev,
      isVisible: false,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      accumulatedDuration: 0,
      estimatedSurahDuration: 0,
    }));
  }, []);

  const setReciter = useCallback(
    (id: ReciterId) => {
      setState((prev) => {
        // Clear duration cache since different reciters have different durations
        ayahDurationsRef.current.clear();
        // Reload audio with new reciter if currently playing
        if (prev.isVisible) {
          loadAndPlay(prev.currentSurahNumber, prev.currentAyahNumber, id);
        }
        return { ...prev, reciterId: id, isPlaying: prev.isVisible, accumulatedDuration: 0, estimatedSurahDuration: 0 };
      });
    },
    [loadAndPlay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Calculate a perfectly smooth normalized elapsed time based on ayah progress
  // This guarantees the timer never jumps and always reaches exactly estimatedSurahDuration
  const surahElapsedTime = useMemo(() => {
    if (!state.estimatedSurahDuration || !state.totalAyahs || state.totalAyahs === 0) return 0;
    
    // If fully finished
    if (state.currentAyahNumber === state.totalAyahs && state.currentTime >= state.duration && state.duration > 0) {
      return state.estimatedSurahDuration;
    }

    const ayahProgress = state.duration > 0 ? state.currentTime / state.duration : 0;
    const surahProgress = (state.currentAyahNumber - 1 + ayahProgress) / state.totalAyahs;
    return surahProgress * state.estimatedSurahDuration;
  }, [state.currentAyahNumber, state.currentTime, state.duration, state.estimatedSurahDuration, state.totalAyahs]);

  return (
    <AudioPlayerContext.Provider
      value={{
        ...state,
        surahElapsedTime,
        playAyah,
        togglePlayPause,
        seekTo,
        nextAyah,
        prevAyah,
        closePlayer,
        setReciter,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
