"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchSurahById, Surah } from "@/lib/api";
import ReaderLayout from "@/components/reader/ReaderLayout";
import AyahList from "@/components/reader/AyahList";
import { Loader2 } from "lucide-react";

function ReadContent() {
  const searchParams = useSearchParams();
  const surahId = searchParams.get("surah") || "1";
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSurahInfo = async () => {
      const id = Number(surahId);
      if (isNaN(id)) return;
      
      setLoading(true);
      try {
        const data = await fetchSurahById(id);
        setSurah(data);
      } catch (error) {
        console.error("Failed to fetch surah info:", error);
      } finally {
        setLoading(false);
      }
    };
    getSurahInfo();
  }, [surahId]);

  return (
    <div className="flex flex-col gap-8">
      {loading ? (
        <div className="h-[200px] flex items-center justify-center bg-bg-content/20 rounded-3xl animate-pulse">
          <Loader2 className="animate-spin text-primary-green/20" size={32} />
        </div>
      ) : surah && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-green/20 to-teal-900/40 p-10 border border-primary-green/20">
          <div className="relative z-10 flex flex-col items-center text-center">
             <h1 className="text-5xl font-serif font-bold text-white mb-2 tracking-tight">{surah.name_english}</h1>
             <p className="text-primary-gold font-medium uppercase tracking-[0.3em] text-sm">{surah.name_arabic}</p>
             <div className="flex items-center gap-4 mt-6 text-text-secondary text-xs uppercase tracking-widest">
                <span>{surah.total_ayahs} Ayahs</span>
                <span className="w-1 h-1 bg-text-secondary rounded-full" />
                <span>{surah.revelation_place}</span>
             </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary-green/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
      )}

      <AyahList />
    </div>
  );
}

export default function ReadPage() {
  return (
    <ReaderLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center py-40">
          <Loader2 className="animate-spin text-primary-green" size={48} />
        </div>
      }>
        <ReadContent />
      </Suspense>
    </ReaderLayout>
  );
}
