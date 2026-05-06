import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Surah {
  id: number;
  number: number;
  name_english: string;
  name_arabic: string;
  revelation_place: string;
  total_ayahs: number;
  name_translation?: string;
  transliteration?: string;
}

export interface Ayah {
  id: number;
  ayah_number: number;
  text_arabic: string;
  audio_url: string;
  translation_en: string;
  translation_bn: string;
}

export interface PaginatedResponse<T> {
  metadata: {
    total: number;
    page: number;
    last_page: number;
  };
  data: T[];
}

export const fetchSurahs = async (): Promise<Surah[]> => {
  const response = await api.get("/quran/surahs");
  return response.data;
};

export const fetchSurahById = async (id: number): Promise<Surah> => {
  const response = await api.get(`/quran/surah/${id}`);
  return response.data;
};

export const fetchAyahs = async (surahId: number, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Ayah>> => {
  const response = await api.get(`/quran/surah/${surahId}/ayahs`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAudioUrl = (surahNumber: number, ayahNumber: number): string => {
  // Construct URL for Quran Audio API (e.g., Everyayah.com or similar)
  // Format usually: https://everyayah.com/data/Alafasy_128kbps/{surah}{ayah}.mp3
  const s = surahNumber.toString().padStart(3, "0");
  const a = ayahNumber.toString().padStart(3, "0");
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
};

export default api;
