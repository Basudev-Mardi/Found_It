"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useItems } from "../context/ItemsContext";
import ItemCard from "../components/ItemCard";

export default function LostItemsPage() {
  const { items, openReportModal, isLoading } = useItems();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCampus, setSelectedCampus] = useState("All Campuses");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Get only lost items (excluding recovered items as requested)
  const lostItems = useMemo(() => {
    return items.filter((item) => item.type === "lost" && item.status !== "Recovered");
  }, [items]);

  // Categories list
  const categories = [
    "All",
    "Electronics",
    "Wallets",
    "Bags",
    "ID Cards",
    "Keys",
    "Bottles",
    "Other",
  ];

  // Filtered lost items
  const filteredItems = useMemo(() => {
    const list = lostItems.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesCampus =
        selectedCampus === "All Campuses" || item.campus === selectedCampus;

      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesCampus && matchesStatus;
    });

    if (sortBy === "oldest") {
      return [...list].reverse();
    }
    return list;
  }, [lostItems, searchQuery, selectedCategory, selectedCampus, selectedStatus, sortBy]);

  const activeMissingCount = lostItems.filter((i) => i.status === "Available").length;
  const recoveredCount = useMemo(() => {
    return items.filter((i) => i.status === "Recovered").length;
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0c242b] via-[#13363e] to-[#0c242b] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4f938]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#d4f938] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#d4f938] animate-pulse" />
              <span>Campus Missing Belongings Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Lost Items Directory
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Have you seen any of these items? Review community reports or publish your own lost belonging to alert students, faculty, and campus security staff.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openReportModal("lost")}
              className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
            >
              <span className="text-base font-black">+</span>
              <span>Report Lost Item</span>
            </button>
            <Link
              href="/found-items"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <span>Check Found Items</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Quick Summary Stats Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-300">Total Lost Reports</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{lostItems.length}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-300">Actively Missing</div>
            <div className="text-xl sm:text-2xl font-black text-[#d4f938] mt-0.5">{activeMissingCount}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-300">Reunited / Recovered</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{recoveredCount}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-300">Campus Recovery Rate</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">84.2%</div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#0c242b] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 flex items-center pl-3 bg-slate-50 border border-slate-200 rounded-xl">
          <svg
            className="w-4 h-4 text-slate-400 shrink-0 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
            <path strokeLinecap="round" d="M16 16L20 20" stroke="currentColor" strokeWidth={2} />
          </svg>
          <input
            type="text"
            placeholder="Search lost items by name, model, building..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-3 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Campus dropdown */}
        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="All Campuses">All Campuses</option>
          <option value="Central Campus">Central Campus</option>
          <option value="North Campus">North Campus</option>
          <option value="South Campus">South Campus</option>
          <option value="West Campus">West Campus</option>
        </select>

        {/* Status dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="All Status">All Missing Items</option>
          <option value="Available">Actively Missing</option>
          <option value="Claim Pending">Claim Pending</option>
        </select>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Helpful Campus Tip Alert */}
      <div className="bg-sky-50 border border-sky-200/90 rounded-2xl p-4 flex items-start gap-3 text-sky-950">
        <span className="text-xl shrink-0">💡</span>
        <div className="text-xs sm:text-sm">
          <strong>Lost your Student ID Card or Dorm Keys?</strong> Report it here immediately and visit the{" "}
          <Link href="/how-it-works" className="underline font-bold text-sky-900">
            Campus Security Headquarters
          </Link>{" "}
          on Central Campus (Ground Floor) to temporarily freeze building access or obtain a temporary key.
        </div>
      </div>

      {/* Grid of Lost Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Showing {filteredItems.length} {filteredItems.length === 1 ? "lost item" : "lost items"}
          </h2>
          {(searchQuery || selectedCategory !== "All" || selectedCampus !== "All Campuses" || selectedStatus !== "All Status") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedCampus("All Campuses");
                setSelectedStatus("All Status");
              }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="w-full h-44 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-200 rounded-full w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3 text-xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching lost items</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any lost items matching your search criteria. Try modifying your keywords or clearing the category filter.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedCampus("All Campuses");
                  setSelectedStatus("All Status");
                }}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={() => openReportModal("lost")}
                className="px-4 py-2 text-xs font-bold bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 rounded-full transition cursor-pointer"
              >
                Report Missing Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
