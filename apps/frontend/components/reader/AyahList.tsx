"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAyahs, fetchSurahById, Ayah, Surah } from "@/lib/api";
import AyahCard from "./AyahCard";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function AyahList() {
  const searchParams = useSearchParams();
  const surahId = Number(searchParams.get("surah")) || 1;
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ayahParam = searchParams.get("ayah");
    if (ayahParam && !loading) {
      const element = document.getElementById(`ayah-${ayahParam}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [searchParams, loading, ayahs]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const [ayahsRes, surahRes] = await Promise.all([
          fetchAyahs(surahId, 1, 300),
          fetchSurahById(surahId)
        ]);
        setAyahs(ayahsRes.data);
        setSurah(surahRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [surahId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-text-secondary bg-bg-main min-h-screen">
        <Loader2 className="animate-spin text-primary-green" size={48} />
        <p className="font-serif font-bold tracking-widest text-sm uppercase">Preparing Ayahs...</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-main min-h-screen">
      {/* Surah Header */}
      {surah && (
        <div className="relative h-64 flex items-center justify-center border-b border-white/5 overflow-hidden">
          {/* Mosque Image */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2">
            <Image
              src={surah.revelation_place.toLowerCase() === 'meccan' ? "/makkah.webp" : "/madinah.webp"}
              alt={surah.revelation_place}
              loading="lazy"
              width={140}
              height={96}
              className="object-contain grayscale invert brightness-200"
            />
          </div>

          <div className="text-center z-10">
            <h1 className="text-4xl font-bold text-white mb-3">
              Surah {surah.name_english}
            </h1>
            <p className="text-text-secondary/60 font-medium tracking-wide capitalize">
              Ayah-{surah.total_ayahs}, {surah.name_translation}
            </p>
          </div>
        </div>
      )}

      {/* Ayahs Container */}
      <div className="max-w-6xl mx-auto px-8 pb-32">
        {ayahs.map((ayah) => (
          <AyahCard
            key={ayah.id}
            ayah={{
              number: ayah.ayah_number,
              juz: 1,
              arabic: ayah.text_arabic,
              translation_en: ayah.translation_en,
              surahNumber: surahId
            }}
          />
        ))}
      </div>
    </div>
  );
}
