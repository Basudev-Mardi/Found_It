"use client";

import React from "react";
import Link from "next/link";

export default function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-full bg-[#d4f938] flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-105 transition-transform">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.8}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" />
          <path strokeLinecap="round" d="M16 16L21 21" stroke="currentColor" />
        </svg>
      </div>
      <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
        FindIt
      </span>
    </Link>
  );
}
