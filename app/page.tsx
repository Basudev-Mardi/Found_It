"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useItems } from "./context/ItemsContext";
import ItemCard from "./components/ItemCard";

export default function Home() {
  const { items, openReportModal, setClaimingItem } = useItems();

  // Filter tabs: "all" | "lost" | "found"
  const [activeTab, setActiveTab] = useState<"all" | "lost" | "found">("all");

  // Search & Select filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCampus, setSelectedCampus] = useState("All Campuses");

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = activeTab === "all" || item.type === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchesCampus =
        selectedCampus === "All Campuses" || item.campus === selectedCampus;

      return matchesTab && matchesSearch && matchesCategory && matchesCampus;
    });
  }, [items, activeTab, searchQuery, selectedCategory, selectedCampus]);

  const featuredFoundItem = items.find((i) => i.id === "item-5") || items[0];

  return (
    <div className="flex flex-col flex-1">
      {/* --- HERO SECTION WITH PHOTOGRAPHIC CAMPUS BACKGROUND --- */}
      <section className="relative min-h-[480px] lg:min-h-[540px] flex items-center overflow-hidden">
        {/* Real Campus Photography Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />

        {/* Dark Cinematic Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/35 backdrop-brightness-95" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Column: Headline & Hero Actions */}
          <div className="max-w-xl text-white">
            {/* Top Tagline */}
            <div className="flex items-center gap-2">
              <span className="text-[#d4f938] text-xs font-black tracking-widest uppercase">
                ONE CAMPUS. ONE COMMUNITY.
              </span>
              <div className="w-16 h-0.5 bg-[#d4f938]/80" />
            </div>

            {/* Main Headline */}
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Lost something?
              <br />
              Let&apos;s{" "}
              <span className="relative inline-block text-[#d4f938]">
                bring it back.
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-3 text-[#d4f938]"
                  viewBox="0 0 250 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 14C60 6 180 4 247 11"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-5 text-slate-200 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              FindIt helps you report lost items and discover found items across
              campus — quickly, transparently, and securely.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openReportModal("lost")}
                className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <span>Report Lost Item</span>
                <span className="font-extrabold text-base">→</span>
              </button>

              <Link
                href="/found-items"
                className="bg-black/40 hover:bg-black/60 border border-white/30 text-white font-semibold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm transition"
              >
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
                  <path strokeLinecap="round" d="M16 16L20 20" stroke="currentColor" strokeWidth={2} />
                </svg>
                <span>Explore Found Items</span>
              </Link>
            </div>

            {/* Metric Highlights */}
            <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">👥</span>
                <div>
                  <div className="text-sm font-black text-white leading-none">10K+</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Campus Members</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xl">📦</span>
                <div>
                  <div className="text-sm font-black text-white leading-none">2.5K+</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Items Handled</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xl">🛡️</span>
                <div>
                  <div className="text-sm font-black text-white leading-none">100%</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Safe &amp; Secure</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Interactive Card */}
          <div className="relative shrink-0 hidden md:block">
            {/* Floating Speech Bubble */}
            <div className="absolute -top-5 -right-6 z-20 bg-white text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xl border border-slate-100 flex items-center gap-1.5 animate-pulse">
              <div className="w-4 h-4 rounded-full bg-[#d4f938] text-slate-950 flex items-center justify-center text-[10px] font-black">
                ✓
              </div>
              <span>Item safely returned</span>
            </div>

            {/* Found Card */}
            <div className="bg-white rounded-2xl p-3.5 shadow-2xl border border-white/60 max-w-[270px] w-full transition hover:scale-[1.02]">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800">Recently found</span>
              </div>

              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src={featuredFoundItem.imageUrl}
                  alt={featuredFoundItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-3 px-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {featuredFoundItem.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{featuredFoundItem.location}</span>
                </div>

                <button
                  onClick={() => setClaimingItem(featuredFoundItem)}
                  className="mt-3 w-full bg-slate-50 hover:bg-[#d4f938] hover:text-slate-950 border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition shadow-xs cursor-pointer"
                >
                  Is this yours?
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FLOATING PILL SEARCH & FILTER BAR --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-30 w-full">
        <div className="bg-white rounded-2xl md:rounded-full shadow-xl border border-slate-200/90 p-2 md:p-2.5 flex flex-col md:flex-row items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 w-full flex items-center pl-4">
            <svg
              className="w-4 h-4 text-slate-400 shrink-0 mr-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
              <path strokeLinecap="round" d="M16 16L20 20" stroke="currentColor" strokeWidth={2} />
            </svg>
            <input
              type="text"
              placeholder="Search for an item, building, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

          {/* All Categories Dropdown */}
          <div className="w-full md:w-auto flex items-center px-3 py-1">
            <svg
              className="w-4 h-4 text-slate-400 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.8} />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.8} />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.8} />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.8} />
            </svg>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pr-4"
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="ID Cards">ID Cards</option>
              <option value="Wallets">Wallets</option>
              <option value="Bottles">Bottles</option>
              <option value="Keys">Keys</option>
              <option value="Bags">Bags</option>
            </select>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

          {/* All Campuses Dropdown */}
          <div className="w-full md:w-auto flex items-center px-3 py-1">
            <svg
              className="w-4 h-4 text-slate-400 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pr-4"
            >
              <option value="All Campuses">All Campuses</option>
              <option value="Central Campus">Central Campus</option>
              <option value="North Campus">North Campus</option>
              <option value="South Campus">South Campus</option>
              <option value="West Campus">West Campus</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={() => {
              const el = document.getElementById("recently-reported");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full md:w-auto bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2.2} />
              <path strokeLinecap="round" d="M16 16L20 20" stroke="currentColor" strokeWidth={2.2} />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 w-full flex-1">
        {/* === SECTION 1: RECENTLY REPORTED === */}
        <section id="recently-reported" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            {/* Title with Tabs right next to it */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Recently reported
              </h2>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveTab("lost")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeTab === "lost"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Lost Items
                </button>
                <button
                  onClick={() => setActiveTab("found")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeTab === "found"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Found Items
                </button>
              </div>
            </div>

            {/* Direct Link to Dedicated Page */}
            <Link
              href={activeTab === "found" ? "/found-items" : "/lost-items"}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 group transition"
            >
              <span>View full {activeTab === "all" ? "directory" : activeTab + " directory"}</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300">
              <p className="text-sm font-semibold text-slate-500">
                No reports found matching your selected criteria.
              </p>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setSelectedCampus("All Campuses");
                }}
                className="mt-3 text-xs font-bold text-slate-900 underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredItems.slice(0, 8).map((item) => (
                <ItemCard key={item.id} item={item} showClaimButton={true} />
              ))}
            </div>
          )}

          {/* Navigation link pills below grid */}
          <div className="mt-8 pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/lost-items"
              className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-5 py-2.5 rounded-full text-xs font-bold transition shadow-2xs flex items-center gap-2"
            >
              <span>Explore All Lost Items Directory</span>
              <span>→</span>
            </Link>
            <Link
              href="/found-items"
              className="bg-[#e2f9d8] hover:bg-[#d4f938]/60 text-[#2d6a22] border border-lime-300 px-5 py-2.5 rounded-full text-xs font-bold transition shadow-2xs flex items-center gap-2"
            >
              <span>Explore All Found Items Directory</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* === SECTION 2: HOW FINDIT WORKS === */}
        <section className="pt-4">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#0c242b] text-xs font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
              How FindIt works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Designed with campus security desks and student unions to make reuniting belongings smooth and safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#e8f8dc] text-slate-900 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">1. Report</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Quickly report your lost or found item with location and details.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#e8f8dc] text-slate-900 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
                  <path strokeLinecap="round" d="M16 16L20 20" stroke="currentColor" strokeWidth={2} />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">2. Discover</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Browse items or get matched if someone turns in your lost property.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#e8f8dc] text-slate-900 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-1.106l-3.5-7A2 2 0 017.746 10H10V5a2 2 0 012-2h0a2 2 0 012 2v5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">3. Reconnect</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Verify ownership securely and pick up your item at campus security.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-black bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-full transition"
            >
              <span>Read Full Step-by-Step Security &amp; Pickup Guide</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* === SECTION 3: TRUST & SAFETY BANNER === */}
        <section className="pt-2">
          <div className="bg-[#e8f8dc] border border-lime-200/80 rounded-2xl sm:rounded-full py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-xs sm:text-sm font-bold text-slate-850 shadow-xs">
            <span className="text-lg">🛡️</span>
            <span>Your safety matters. Ownership is strictly verified with campus student ID before any item is handed over.</span>
            <Link
              href="/dashboard"
              className="ml-0 sm:ml-3 underline text-slate-950 font-black hover:text-emerald-900"
            >
              View My Dashboard →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
