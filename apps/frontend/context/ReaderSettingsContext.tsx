"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ReaderSettings {
  arabicFontSize: number;
  translationFontSize: number;
  arabicFont: "Amiri" | "KFGQ";
}

interface ReaderSettingsContextType extends ReaderSettings {
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setArabicFont: (font: "Amiri" | "KFGQ") => void;
}

const ReaderSettingsContext = createContext<ReaderSettingsContextType | undefined>(undefined);

export function ReaderSettingsProvider({ children }: { children: React.ReactNode }) {
  const [arabicFontSize, setArabicFontSize] = useState(32);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [arabicFont, setArabicFont] = useState<"Amiri" | "KFGQ">("Amiri");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("reader-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setArabicFontSize(parsed.arabicFontSize || 32);
        setTranslationFontSize(parsed.translationFontSize || 16);
        setArabicFont(parsed.arabicFont || "Amiri");
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    if (isLoaded) {
      const settings = { arabicFontSize, translationFontSize, arabicFont };
      localStorage.setItem("reader-settings", JSON.stringify(settings));
    }
  }, [arabicFontSize, translationFontSize, arabicFont, isLoaded]);

  return (
    <ReaderSettingsContext.Provider
      value={{
        arabicFontSize,
        translationFontSize,
        arabicFont,
        setArabicFontSize,
        setTranslationFontSize,
        setArabicFont,
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
