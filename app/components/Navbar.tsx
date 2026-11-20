"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";
import { useItems } from "../context/ItemsContext";

export default function Navbar() {
  const pathname = usePathname();
  const { openReportModal } = useItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Lost Items", href: "/lost-items" },
    { label: "Found Items", href: "/found-items" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <BrandLogo />

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  active
                    ? "text-slate-950 font-bold border-b-2 border-slate-950"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openReportModal("lost")}
            className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <span>Report an Item</span>
            <span className="text-base font-extrabold">→</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-semibold rounded-lg px-2 transition ${
                  active
                    ? "bg-slate-100 text-slate-950 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openReportModal("lost");
              }}
              className="flex-1 py-2 text-xs font-bold bg-[#0c242b] text-white rounded-lg text-center"
            >
              Report Lost
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openReportModal("found");
              }}
              className="flex-1 py-2 text-xs font-bold bg-[#d4f938] text-slate-950 rounded-lg text-center"
            >
              Report Found
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
