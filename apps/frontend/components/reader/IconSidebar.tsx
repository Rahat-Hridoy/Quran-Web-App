"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { icon: "/icons/home.svg", label: "Home", href: "/", width: 22, height: 22 },
  { icon: "/icons/read-quran.svg", label: "Read Quran", href: "/read", width: 26, height: 26 },
  { icon: "/icons/go-to-ayah.svg", label: "Go to Ayah", href: "#", width: 22, height: 22 },
  { icon: "/icons/bookmark.svg", label: "Bookmark", href: "#", width: 16, height: 18 },
  { icon: "/icons/more.svg", label: "More", href: "#", width: 22, height: 22 },
];

export default function IconSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 bg-[#171717] border-r border-white/5 flex flex-col items-center z-50 h-full relative">
      {/* Logo - Top */}
      <div className="h-[72px] flex items-center justify-center border-b border-white/5">
        <Link href="/" className="group relative">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(46,125,50,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(46,125,50,0.5)] transition-all duration-500">
            <Image 
              src="/icons/logo.svg" 
              alt="Quran Web App" 
              width={36} 
              height={36} 
              className="drop-shadow-sm"
            />
          </div>
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        {/* Navigation - Middle */}
        <nav className="flex flex-col justify-center items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`p-2 rounded-2xl transition-all duration-300 group relative flex items-center justify-center ${isActive
                  ? "text-primary-green"
                  : "text-[#555] hover:text-white"
                  }`}
              >
                {/* Icon using mask-image to maintain currentColor support */}
                <div
                  className={`transition-all duration-300 bg-current ${isActive ? "scale-100" : "group-hover:scale-110"}`}
                  style={{
                    width: `${item.width}px`,
                    height: `${item.height}px`,
                    maskImage: `url(${item.icon})`,
                    WebkitMaskImage: `url(${item.icon})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                />

                {/* Active Glow Indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary-green/5 rounded-2xl blur-md" />
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-white/80 rounded-lg text-[13px] font-medium text-black opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Empty space at bottom to balance top logo space */}
      <div className="h-20" />
    </aside>
  );
}
