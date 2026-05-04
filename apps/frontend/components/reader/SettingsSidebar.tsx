"use client";

import { X, ChevronDown, ChevronUp, Settings as SettingsIcon, Book, Type, Heart } from "lucide-react";
import { useState } from "react";
import { useReaderSettings } from "@/context/ReaderSettingsContext";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const [activeTab, setActiveTab] = useState<"translation" | "reading">("translation");
  const [expandedSection, setExpandedSection] = useState<string | null>("font");

  const {
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize,
    arabicFont, setArabicFont,
    translationLanguage, setTranslationLanguage,
    wordByWordLanguage, setWordByWordLanguage,
    translator, setTranslator
  } = useReaderSettings();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`relative w-full max-w-[320px] h-full bg-[#111111] border-l border-white/10 flex flex-col shadow-2xl transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-green/10 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary-green" />
            </div>
            <h2 className="text-[17px] font-bold text-white tracking-tight">Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab System */}
        <div className="px-6 py-5">
          <div className="bg-[#171717] p-1 rounded-full flex gap-1 border border-white/5">
            <button
              onClick={() => setActiveTab("translation")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === "translation"
                  ? "bg-bg-main text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Translation
            </button>
            <button
              onClick={() => setActiveTab("reading")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === "reading"
                  ? "bg-bg-main text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Reading
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-4">
          {activeTab === "translation" && (
            <>
              {/* Reading Settings Section */}
              <div className="border border-white/5 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleSection("reading")}
                  className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Book className="w-4 h-4 text-white/40" />
                    <span className="text-[14px] font-bold text-white">Reading Settings</span>
                  </div>
                  {expandedSection === "reading" ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </button>

                {expandedSection === "reading" && (
                  <div className="p-4 pt-0 space-y-5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-text-secondary/40 uppercase tracking-widest">
                        Translation Selector
                      </label>
                      <div className="relative">
                        <select
                          value={translator}
                          onChange={(e) => setTranslator(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-[13px] text-white appearance-none focus:outline-none focus:border-primary-green/30"
                        >
                          <option value="Sahih International">Sahih International</option>
                          <option value="Mufti Taqi Usmani">Mufti Taqi Usmani</option>
                          <option value="Mohsin Khan">Mohsin Khan</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-text-secondary/40 uppercase tracking-widest">
                        Word-by-Word Language
                      </label>
                      <div className="relative">
                        <select
                          value={wordByWordLanguage}
                          onChange={(e) => {
                            const val = e.target.value as "english" | "bangla";
                            setWordByWordLanguage(val);
                            setTranslationLanguage(val);
                          }}
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-[13px] text-white appearance-none focus:outline-none focus:border-primary-green/30"
                        >
                          <option value="english">English</option>
                          <option value="bangla">Bangla</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Font Settings Section */}
              <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                expandedSection === "font" ? "border-primary-green/20 bg-primary-green/[0.02]" : "border-white/5 bg-transparent"
              }`}>
                <button
                  onClick={() => toggleSection("font")}
                  className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Type className={`w-4 h-4 ${expandedSection === "font" ? "text-primary-green" : "text-white/40"}`} />
                    <span className={`text-[14px] font-bold ${expandedSection === "font" ? "text-primary-green" : "text-white"}`}>
                      Font Settings
                    </span>
                  </div>
                  {expandedSection === "font" ? (
                    <ChevronUp className="w-4 h-4 text-primary-green" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </button>

                {expandedSection === "font" && (
                  <div className="p-4 pt-0 space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* Arabic Font Size */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[13px] font-medium text-white/80">Arabic Font Size</label>
                        <span className="text-[13px] font-bold text-primary-green">{arabicFontSize}</span>
                      </div>
                      <input
                        type="range"
                        min="24"
                        max="64"
                        step="2"
                        value={arabicFontSize}
                        onChange={(e) => setArabicFontSize(Number(e.target.value))}
                        className="w-full h-[3px] bg-[#222222] rounded-full appearance-none cursor-pointer accent-primary-green"
                      />
                    </div>

                    {/* Translation Font Size */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[13px] font-medium text-white/80">Translation Font Size</label>
                        <span className="text-[13px] font-bold text-primary-green">{translationFontSize}</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="32"
                        step="1"
                        value={translationFontSize}
                        onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                        className="w-full h-[3px] bg-[#222222] rounded-full appearance-none cursor-pointer accent-primary-green"
                      />
                    </div>

                    {/* Arabic Font Face */}
                    <div className="space-y-3 pt-2">
                      <label className="text-[13px] font-medium text-white/80">Arabic Font Face</label>
                      <div className="relative">
                        <select
                          value={arabicFont}
                          onChange={(e) => setArabicFont(e.target.value as any)}
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-[13px] text-white appearance-none focus:outline-none focus:border-primary-green/30"
                        >
                          <option value="KFGQ">KFGQ</option>
                          <option value="Indopak">Indopak</option>
                          <option value="Amiri">Amiri</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "reading" && (
            <div className="flex flex-col items-center justify-center py-10 opacity-30">
              <Book className="w-10 h-10 mb-3" />
              <p className="text-sm">Reading settings coming soon</p>
            </div>
          )}
        </div>

        {/* Footer / Support Card */}
        <div className="p-6">
          <div className="bg-[#141d13] border border-primary-green/10 rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:border-primary-green/30 transition-all">
            <div className="relative z-10">
              <h4 className="text-[15px] font-bold text-white mb-1">Help spread the knowledge of Islam</h4>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Your regular support helps us reach our religious brothers and sisters with the...
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Heart className="w-20 h-20 text-primary-green fill-primary-green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
