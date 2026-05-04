"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAyahs, Ayah } from "@/lib/api";
import AyahCard from "./AyahCard";
import { Loader2 } from "lucide-react";

export default function AyahList() {
  const searchParams = useSearchParams();
  const surahId = Number(searchParams.get("surah")) || 1;
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAyahs = async () => {
      setLoading(true);
      try {
        const response = await fetchAyahs(surahId, 1, 300); // Fetch all verses for the surah
        setAyahs(response.data);
      } catch (error) {
        console.error("Failed to fetch ayahs:", error);
      } finally {
        setLoading(false);
      }
    };
    getAyahs();
  }, [surahId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-text-secondary">
        <Loader2 className="animate-spin text-primary-green" size={48} />
        <p className="font-serif font-bold tracking-widest text-sm uppercase">Preparing Ayahs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {ayahs.map((ayah) => (
        <AyahCard 
          key={ayah.id} 
          ayah={{
            number: ayah.ayah_number,
            juz: 1, // backend could provide this, defaulting for now
            arabic: ayah.text_arabic,
            translation_en: ayah.translation_en,
            translation_bn: ayah.translation_bn,
            surahNumber: surahId
          }} 
        />
      ))}
    </div>
  );
}
