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
    <div className="w-[340px] h-full bg-bg-sidebar border-r border-white/5 flex flex-col">
      {/* Tab Switcher */}
      <div className="p-6 pb-0">
        <div className="bg-[#1a1a1a] p-1 rounded-full flex gap-1 border border-white/5">
          {(["surah", "juz", "page"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[13px] font-medium capitalize rounded-full transition-all duration-300 ${activeTab === tab
                  ? "bg-[#000000] text-white shadow-sm"
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
            placeholder={`Search ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/5 rounded-full py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:border-primary-green/50 transition-all placeholder:text-text-secondary/30"
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
            {filteredSurahs.map((surah) => (
              <button
                key={surah.id}
                onClick={() => handleSurahClick(surah.id)}
                className={`w-full group flex items-center gap-5 p-4 rounded-2xl transition-all border ${activeSurahId === surah.id.toString()
                    ? "bg-[#1a1a1a] border-primary-green/40 shadow-lg shadow-primary-green/5"
                    : "bg-[#0f0f0f] border-white/5 hover:bg-[#1a1a1a] hover:border-white/10"
                  }`}
              >
                {/* Diamond Badge */}
                <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <div className={`absolute inset-0 rotate-45 rounded-lg transition-colors ${activeSurahId === surah.id.toString() ? "bg-primary-green" : "bg-[#1a1a1a]"
                    }`} />
                  <span className={`relative text-xs font-bold ${activeSurahId === surah.id.toString() ? "text-white" : "text-text-secondary group-hover:text-primary-green"}`}>
                    {surah.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h4 className={`text-[15px] font-bold transition-colors truncate ${activeSurahId === surah.id.toString() ? "text-white" : "text-text-primary group-hover:text-primary-green"}`}>
                    {surah.name_english}
                  </h4>
                  <p className="text-[12px] text-text-secondary/60 transition-colors mt-0.5 truncate capitalize">
                    {surah.revelation_place}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
