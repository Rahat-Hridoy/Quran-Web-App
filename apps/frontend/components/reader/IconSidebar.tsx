"use client";

import { Home, BookOpen, Hash, Bookmark, MoreHorizontal, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Read Quran", href: "/read" },
  { icon: Hash, label: "Go to Ayah", href: "#" },
  { icon: Bookmark, label: "Bookmark", href: "#" },
  { icon: MoreHorizontal, label: "More", href: "#" },
];

export default function IconSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 bg-bg-sidebar border-r border-border-subtle flex flex-col items-center py-8 gap-10 z-30">
      {/* Logo */}
      <Link href="/" className="group relative">
        <div className="w-12 h-12 bg-primary-green/20 rounded-2xl flex items-center justify-center border border-primary-green/30 group-hover:scale-110 transition-all duration-300">
          <div className="w-8 h-8 bg-primary-green rounded-xl shadow-[0_0_15px_rgba(46,125,50,0.5)] flex items-center justify-center">
            <span className="font-serif font-bold text-white text-xs">QM</span>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`p-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? "bg-primary-green text-white shadow-lg shadow-primary-green/20" 
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={22} strokeWidth={2} />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-bg-content border border-border-subtle rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto">
        <button className="p-3 text-text-secondary hover:text-white transition-colors">
          <Settings size={22} />
        </button>
      </div>
    </aside>
  );
}
