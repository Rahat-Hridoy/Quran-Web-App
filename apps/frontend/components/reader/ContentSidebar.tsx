"use client";

import { Search, Book, Bookmark, List, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSurahs, Surah } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

export default function ContentSidebar() {
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
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
    router.push(`/read?${params.toString()}`);
  };

  const filteredSurahs = surahs.filter(s => 
    s.name_english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[340px] h-full bg-bg-sidebar border-r border-border-subtle flex flex-col">
      {/* Tab Switcher */}
      <div className="p-6">
        <div className="bg-bg-content/50 p-1 rounded-xl flex gap-1 border border-border-subtle">
          {(["surah", "juz", "page"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === tab 
                  ? "bg-primary-green text-white shadow-lg shadow-primary-green/20" 
                  : "text-text-secondary hover:text-white"
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
            placeholder="Search Surah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-content border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary-green/30 transition-all"
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary">
            <Loader2 className="animate-spin text-primary-green/30" />
            <span className="text-[10px] uppercase tracking-widest">Loading Library...</span>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.id}
                onClick={() => handleSurahClick(surah.id)}
                className={`w-full group flex items-center gap-4 p-3 rounded-xl transition-all ${
                  activeSurahId === surah.id.toString() 
                    ? "bg-primary-green/10 border border-primary-green/20" 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                  activeSurahId === surah.id.toString() ? "bg-primary-green text-white" : "bg-bg-content text-text-secondary group-hover:text-primary-green"
                }`}>
                  {surah.number}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h4 className={`text-sm font-semibold transition-colors truncate ${activeSurahId === surah.id.toString() ? "text-primary-green" : "text-text-primary group-hover:text-primary-green"}`}>
                    {surah.name_english}
                  </h4>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider truncate">
                    {surah.revelation_place}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-arabic text-text-primary mb-0.5">{surah.name_arabic}</p>
                  <span className="text-[10px] font-mono text-text-secondary/40">
                    {surah.total_ayahs} Ayahs
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
