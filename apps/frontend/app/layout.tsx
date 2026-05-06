import type { Metadata } from "next";
import { Inter, Cinzel, Amiri, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel-decorative",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "Quran Mazid - Read, Study, and Learn The Quran",
  description: "A beautiful Quran web application",
};

import { ReaderSettingsProvider } from "@/context/ReaderSettingsContext";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} ${cinzelDecorative.variable} ${amiri.variable} font-sans antialiased`}>
        <ReaderSettingsProvider>
          <AudioPlayerProvider>
            {children}
          </AudioPlayerProvider>
        </ReaderSettingsProvider>
      </body>
    </html>
  );
}
