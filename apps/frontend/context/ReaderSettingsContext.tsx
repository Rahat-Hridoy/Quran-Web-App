"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ReaderSettings {
  arabicFontSize: number;
  translationFontSize: number;
  arabicFont: "Amiri" | "KFGQ" | "Indopak";
  translationLanguage: "english" | "bangla";
  wordByWordLanguage: "english" | "bangla";
  translator: string;
  activeMushaf: "unicode" | "hafezi" | "madani" | "indopak";
}

interface ReaderSettingsContextType extends ReaderSettings {
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setArabicFont: (font: "Amiri" | "KFGQ" | "Indopak") => void;
  setTranslationLanguage: (lang: "english" | "bangla") => void;
  setWordByWordLanguage: (lang: "english" | "bangla") => void;
  setTranslator: (translator: string) => void;
  setMushaf: (mushaf: "unicode" | "hafezi" | "madani" | "indopak") => void;
}

const ReaderSettingsContext = createContext<ReaderSettingsContextType | undefined>(undefined);

export function ReaderSettingsProvider({ children }: { children: React.ReactNode }) {
  const [arabicFontSize, setArabicFontSize] = useState(32);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [arabicFont, setArabicFont] = useState<"Amiri" | "KFGQ" | "Indopak">("KFGQ");
  const [translationLanguage, setTranslationLanguage] = useState<"english" | "bangla">("english");
  const [wordByWordLanguage, setWordByWordLanguage] = useState<"english" | "bangla">("english");
  const [translator, setTranslator] = useState("Sahih International");
  const [activeMushaf, setActiveMushaf] = useState<"unicode" | "hafezi" | "madani" | "indopak">("unicode");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("reader-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setArabicFontSize(parsed.arabicFontSize || 32);
        setTranslationFontSize(parsed.translationFontSize || 16);
        setArabicFont(parsed.arabicFont || "KFGQ");
        setTranslationLanguage(parsed.translationLanguage || "english");
        setWordByWordLanguage(parsed.wordByWordLanguage || "english");
        setTranslator(parsed.translator || "Sahih International");
        setActiveMushaf(parsed.activeMushaf || "unicode");
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    if (isLoaded) {
      const settings = {
        arabicFontSize,
        translationFontSize,
        arabicFont,
        translationLanguage,
        wordByWordLanguage,
        translator,
        activeMushaf
      };
      localStorage.setItem("reader-settings", JSON.stringify(settings));
    }
  }, [arabicFontSize, translationFontSize, arabicFont, translationLanguage, wordByWordLanguage, translator, activeMushaf, isLoaded]);

  const setMushaf = (mushaf: "unicode" | "hafezi" | "madani" | "indopak") => {
    setActiveMushaf(mushaf);
  };

  return (
    <ReaderSettingsContext.Provider
      value={{
        arabicFontSize,
        translationFontSize,
        arabicFont,
        translationLanguage,
        wordByWordLanguage,
        translator,
        activeMushaf,
        setArabicFontSize,
        setTranslationFontSize,
        setArabicFont,
        setTranslationLanguage,
        setWordByWordLanguage,
        setTranslator,
        setMushaf,
      }}
    >
      {children}
    </ReaderSettingsContext.Provider>
  );
}

export function useReaderSettings() {
  const context = useContext(ReaderSettingsContext);
  if (context === undefined) {
    throw new Error("useReaderSettings must be used within a ReaderSettingsProvider");
  }
  return context;
}
