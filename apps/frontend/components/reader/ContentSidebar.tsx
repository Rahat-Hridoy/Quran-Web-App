"use client";

import { Search, Book, Bookmark, List, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSurahs, Surah } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { JUZ_DATA, JuzData } from "@/lib/juz-data";

export default function ContentSidebar() {
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedJuzId, setExpandedJuzId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSurahId = searchParams.get("surah") || "1";

  useEffect(() => {
    const getSurahs = async () => {
      try {
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
      } finally {
        setLoading(false);
      }
    };
    getSurahs();
  }, []);



  const handleSurahClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("surah", id.toString());
    params.delete("ayah"); // Reset ayah when surah changes
    router.push(`/read?${params.toString()}`);
  };

  const handleAyahClick = (ayahNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ayah", ayahNumber.toString());
    router.push(`/read?${params.toString()}`);
  };

  const filteredSurahs = surahs.filter(s =>
    s.name_english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAyahs = ayahs.filter(a =>
    a.ayah_number.toString().includes(searchQuery)
  );
  
  const filteredJuz = JUZ_DATA.filter(j => 
    j.id.toString().includes(searchQuery) || 
    j.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[300px] h-full bg-bg-sidebar border-r border-white/5 flex flex-col">
      {/* Tab Switcher */}
      <div className="p-6 pb-0">
        <div className="bg-[#171717] p-1 rounded-full flex gap-1 border border-white/5">
          {(["surah", "juz", "page"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium capitalize rounded-full transition-all duration-300 hover:cursor-pointer ${activeTab === tab
                ? "bg-bg-main text-white text-sm shadow-sm"
                : "text-white/60 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />
          <input
            type="text"
            placeholder={`Search ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/5 rounded-full py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:border-primary-green/50 transition-all placeholder:text-text-secondary/30 h-10"
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary">
            <Loader2 className="animate-spin text-primary-green/30" />
            <span className="text-[10px] uppercase tracking-widest">Loading Library...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === "surah" && filteredSurahs.map((surah) => (
              <div
                key={surah.id}
                onClick={() => handleSurahClick(surah.id)}
                role="button"
                className={`group/card flex w-full min-w-[200px] cursor-pointer select-none items-center justify-start gap-4 px-4 py-3 rounded-xl transition-all duration-300 border ${activeSurahId === surah.id.toString()
                  ? "bg-primary-green/10 border-primary-green/20 shadow-lg"
                  : "bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20"
                  }`}
              >
                {/* Number Badge (Diamond Shape) */}
                <div className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center py-3">
                  <div className={`absolute inset-0 rotate-45 rounded-lg transition-all duration-300 ${activeSurahId === surah.id.toString()
                    ? "bg-primary-green shadow-md shadow-primary-green/20"
                    : "bg-[#1a1a1a] group-hover/card:bg-primary-green/10"
                    }`} />
                  <span className={`relative text-[13px] font-bold transition-colors ${activeSurahId === surah.id.toString() ? "text-white" : "text-text-secondary group-hover/card:text-primary-green"}`}>
                    {surah.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h4 className={`text-[15px] font-bold transition-colors truncate ${activeSurahId === surah.id.toString() ? "text-white" : "text-text-primary group-hover/card:text-primary-green"}`}>
                    {surah.name_english}
                  </h4>
                  <p className="text-[12px] text-text-secondary/50 transition-colors mt-0.5 truncate capitalize font-medium">
                    {surah.name_translation}
                  </p>
                </div>
              </div>
            ))}

            {activeTab === "juz" && filteredJuz.map((juz) => (
              <div key={juz.id} className="space-y-2">
                <div
                  onClick={() => setExpandedJuzId(expandedJuzId === juz.id ? null : juz.id)}
                  role="button"
                  className={`group/juz flex w-full cursor-pointer select-none items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 border ${expandedJuzId === juz.id
                    ? "bg-primary-green/5 border-primary-green/20"
                    : "bg-transparent border-white/5 hover:bg-white/5"
                    }`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-primary-green text-[14px] font-bold">
                      Juz {juz.id}
                    </span>
                    <span className="text-text-secondary/60 text-[12px] font-medium">
                      {juz.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-white text-[13px] font-bold">
                      {juz.surah_ids.length}
                    </span>
                    <span className="text-text-secondary/40 text-[10px] uppercase tracking-wider">
                      Surah
                    </span>
                  </div>
                </div>

                {expandedJuzId === juz.id && (
                  <div className="pl-4 space-y-2 border-l border-white/5 ml-2 mt-2">
                    {juz.surah_ids.map((surahId) => {
                      const surah = surahs.find(s => s.number === surahId);
                      if (!surah) return null;
                      const isActive = activeSurahId === surah.id.toString();
                      
                      return (
                        <div
                          key={surah.id}
                          onClick={() => handleSurahClick(surah.id)}
                          role="button"
                          className={`group/card flex w-full cursor-pointer select-none items-center justify-start gap-4 px-4 py-3 rounded-xl transition-all duration-300 border ${isActive
                            ? "bg-primary-green/10 border-primary-green/20 shadow-md"
                            : "bg-[#141414] border-white/5 hover:bg-white/5 hover:border-white/10"
                            }`}
                        >
                          {/* Number Badge (Diamond Shape) */}
                          <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
                            <div className={`absolute inset-0 rotate-45 rounded-md transition-all duration-300 ${isActive
                              ? "bg-primary-green shadow-sm shadow-primary-green/20"
                              : "bg-[#1a1a1a] group-hover/card:bg-primary-green/10"
                              }`} />
                            <span className={`relative text-[11px] font-bold transition-colors ${isActive ? "text-white" : "text-text-secondary group-hover/card:text-primary-green"}`}>
                              {surah.number}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <h4 className={`text-[13px] font-bold transition-colors truncate ${isActive ? "text-white" : "text-text-primary group-hover/card:text-primary-green"}`}>
                              {surah.name_english}
                            </h4>
                            <p className="text-[11px] text-text-secondary/50 transition-colors mt-0.5 truncate capitalize font-medium">
                              {surah.name_translation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}


          </div>
        )}
      </div>
    </div>
  );
}
