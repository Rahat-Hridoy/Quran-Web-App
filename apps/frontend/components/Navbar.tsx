"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Heart, BookOpen, Settings, Sun } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Read Quran", href: "/read" },
    { name: "Prayer Time", href: "/prayer" },
    { name: "Ramadan 2026", href: "/ramadan" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-0">
              <img src="/icons/logo.svg" alt="Quran Mazid" className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-banner leading-tight">Quran Mazid</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Read, Study, and Learn The Quran</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-1 text-gray-300 cursor-pointer text-sm font-medium hover:text-white">
              <span>Others</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all">
              <div className="w-5 h-5 rounded-full border-2 border-primary-green relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-primary-green"></div>
              </div>
            </button>
            <button className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-[#428038] hover:bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-green-900/20 group">
              <span>Support Us</span>
              <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#0d0d0d] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden pt-24 px-6`}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-medium text-gray-300 hover:text-white border-b border-white/5 pb-4"
            >
              {link.name}
            </Link>
          ))}
          <button className="mt-4 flex items-center justify-center gap-2 bg-primary-green text-white py-4 rounded-2xl text-lg font-bold">
            <span>Support Us</span>
            <Heart className="w-5 h-5 fill-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
