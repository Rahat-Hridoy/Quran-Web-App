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
