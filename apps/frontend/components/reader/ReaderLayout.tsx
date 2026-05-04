"use client";

import { useState, useEffect, Suspense } from "react";
import { Menu, X, Loader2 } from "lucide-react";
import IconSidebar from "./IconSidebar";
import ContentSidebar from "./ContentSidebar";
import ReaderHeader from "./ReaderHeader";

interface ReaderLayoutProps {
  children: React.ReactNode;
}

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on window resize if it's large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-bg-main text-text-primary overflow-hidden font-sans relative">
      {/* 1. Icon Sidebar (Desktop: Visible, Full Height) */}
      <div className="hidden lg:flex">
        <IconSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header spanning across ContentSidebar and Main Reader */}
        <Suspense fallback={<div className="h-[72px] border-b border-white/5 bg-[#101010] animate-pulse" />}>
          <ReaderHeader />
        </Suspense>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-green rounded-full shadow-2xl z-[70] flex items-center justify-center text-white"
          >
            <Menu size={24} />
          </button>

          {/* 2. Content Sidebar (Desktop) */}
          <div className="hidden md:flex h-full">
            <Suspense fallback={<div className="w-[340px] bg-bg-sidebar animate-pulse" />}>
              <ContentSidebar />
            </Suspense>
          </div>

          {/* Mobile Drawer (Sidebar on small screens) */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
              />

              {/* Drawer Content */}
              <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[400px] bg-bg-sidebar flex animate-in slide-in-from-left duration-300 shadow-2xl">
                <div className="flex flex-col h-full w-full">
                  <div className="p-4 flex justify-between items-center border-b border-white/5">
                    <span className="font-serif font-bold text-primary-gold uppercase tracking-widest">QURAN MAZID</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-text-secondary">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex flex-1 overflow-hidden">
                    <div className="w-20 border-r border-white/5 overflow-y-auto pt-4 bg-bg-main">
                      <IconSidebar />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <Suspense fallback={<div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary-green" /></div>}>
                        <ContentSidebar />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Main Reader (Right) */}
          <main className="flex-1 flex flex-col min-w-0 bg-bg-main relative overflow-y-auto custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
