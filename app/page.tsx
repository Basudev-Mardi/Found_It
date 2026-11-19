"use client";

import React, { useState, useMemo, useEffect } from "react";

// --- Types ---
interface Item {
  id: string;
  title: string;
  category: string;
  campus: string;
  location: string;
  date: string;
  description: string;
  status: "Available" | "Claim Pending" | "Recovered";
  type: "lost" | "found";
  imageUrl: string;
  reporter?: string;
  contactEmail?: string;
}

// --- Initial Mock Data matching the new screenshot ---
const INITIAL_ITEMS: Item[] = [
  {
    id: "item-1",
    title: "Wireless Headphones",
    category: "Electronics",
    campus: "North Campus",
    location: "Library",
    date: "Nov 19, 2026",
    description: "Matte black over-ear Bluetooth headphones with protective travel case.",
    status: "Available",
    type: "lost",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    reporter: "Ethan K. (Arts & Sciences)",
  },
  {
    id: "item-2",
    title: "Student ID Card",
    category: "ID Cards",
    campus: "Central Campus",
    location: "Main Building",
    date: "Nov 18, 2026",
    description: "Official University Student ID card found on 1st floor lobby table (photo obscured for privacy).",
    status: "Available",
    type: "found",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=700&q=80",
    reporter: "Campus Security Desk",
  },
  {
    id: "item-3",
    title: "Wallet",
    category: "Wallets",
    campus: "South Campus",
    location: "Cafeteria",
    date: "Nov 17, 2026",
    description: "Black leather bifold wallet with contrast brown stitching. Important cards inside.",
    status: "Available",
    type: "lost",
    imageUrl:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80",
    reporter: "Marcus L. (Economics)",
  },
  {
    id: "item-4",
    title: "Water Bottle",
    category: "Bottles",
    campus: "West Campus",
    location: "Sports Complex",
    date: "Nov 16, 2026",
    description: "Stainless steel 750ml insulated flask bottle with metallic matte sheen and silver cap.",
    status: "Available",
    type: "found",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80",
    reporter: "Fitness Center Reception",
  },
  {
    id: "item-5",
    title: "Brass Keyring Set",
    category: "Keys",
    campus: "Central Campus",
    location: "Central Library",
    date: "Nov 18, 2026",
    description: "Three brass dorm keys on a circular metallic ring with a small black tag.",
    status: "Available",
    type: "found",
    imageUrl:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=700&q=80",
    reporter: "Library 2nd Floor Desk",
  },
  {
    id: "item-6",
    title: "Blue College Backpack",
    category: "Bags",
    campus: "North Campus",
    location: "Engineering Block",
    date: "Nov 17, 2026",
    description: "Navy blue college backpack with laptop sleeve and small tear near outer pocket zipper.",
    status: "Available",
    type: "lost",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    reporter: "Sophia T. (Computer Science)",
  },
];

// --- Fallback Icon for image errors ---
function FallbackThumbnail({ title }: { title: string }) {
  return (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-400">
      <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-[10px] text-center font-medium line-clamp-1">{title}</span>
    </div>
  );
}

// --- Logo Component ---
function BrandLogo() {
  return (
    <a href="#" className="flex items-center gap-2 group">
      {/* Lime magnifying glass icon matching screenshot */}
      <div className="w-7 h-7 rounded-full bg-[#d4f938] flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-105 transition-transform">
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
    </a>
  );
}

export default function Home() {
  // --- Master Items State ---
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  // Filter tabs: "all" | "lost" | "found"
  const [activeTab, setActiveTab] = useState<"all" | "lost" | "found">("all");

  // Search & Select filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCampus, setSelectedCampus] = useState("All Campuses");

  // Modals
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Claim State
  const [claimProof, setClaimProof] = useState("");
  const [claimEmail, setClaimEmail] = useState("");
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Report Modal State
  const [newType, setNewType] = useState<"lost" | "found">("lost");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newCampus, setNewCampus] = useState("Central Campus");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState("Nov 19, 2026");
  const [newDescription, setNewDescription] = useState("");
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setNewDate(today);
  }, []);

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

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("Photo must be less than 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(reader.result as string);
      showToast("Photo attached successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        showToast("Photo must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result as string);
        showToast("Photo attached successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit report
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newDescription) return;

    const newItem: Item = {
      id: `item-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      campus: newCampus,
      location: newLocation,
      date: newDate,
      description: newDescription,
      status: "Available",
      type: newType,
      imageUrl:
        newPhoto ||
        "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=700&q=80",
      reporter: "You (Submitted Just Now)",
    };

    setItems((prev) => [newItem, ...prev]);
    setIsReportModalOpen(false);
    setNewTitle("");
    setNewLocation("");
    setNewDescription("");
    setNewPhoto(null);
    showToast(`Your ${newType} item report has been published!`);
  };

  // Submit claim
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimProof || !claimEmail) return;

    if (claimingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === claimingItem.id
            ? { ...item, status: "Claim Pending" }
            : item
        )
      );
    }

    setClaimSubmitted(true);
    setTimeout(() => {
      setClaimSubmitted(false);
      setClaimingItem(null);
      setClaimProof("");
      setClaimEmail("");
      showToast("Verification submitted! Campus Security will verify your request.");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-800 flex flex-col font-sans selection:bg-[#d4f938] selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0c242b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#d4f938]/30 flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-[#d4f938]" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo />

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold text-slate-700">
            <a
              href="#"
              className="text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5"
            >
              Home
            </a>
            <button
              onClick={() => {
                setActiveTab("lost");
                const el = document.getElementById("recently-reported");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-slate-950 transition"
            >
              Lost Items
            </button>
            <button
              onClick={() => {
                setActiveTab("found");
                const el = document.getElementById("recently-reported");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-slate-950 transition"
            >
              Found Items
            </button>
            <a href="#how-it-works" className="hover:text-slate-950 transition">
              How It Works
            </a>
            <a href="#" className="hover:text-slate-950 transition">
              Dashboard
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setNewType("lost");
                setIsReportModalOpen(true);
              }}
              className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <span>Report an Item</span>
              <span className="text-base font-extrabold">→</span>
            </button>

            {/* Mobile Menu Toggle */}
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

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg">
            <a href="#" className="block py-1.5 text-sm font-bold text-slate-900">
              Home
            </a>
            <button
              onClick={() => {
                setActiveTab("lost");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1.5 text-sm font-medium text-slate-600"
            >
              Lost Items
            </button>
            <button
              onClick={() => {
                setActiveTab("found");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1.5 text-sm font-medium text-slate-600"
            >
              Found Items
            </button>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-slate-600"
            >
              How It Works
            </a>
            <a href="#" className="block py-1.5 text-sm font-medium text-slate-600">
              Dashboard
            </a>
          </div>
        )}
      </header>

      {/* --- HERO SECTION WITH PHOTOGRAPHIC CAMPUS BACKGROUND --- */}
      <section className="relative min-h-[460px] lg:min-h-[520px] flex items-center overflow-hidden">
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
              campus — quickly and securely.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setNewType("lost");
                  setIsReportModalOpen(true);
                }}
                className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
              >
                <span>Report Lost Item</span>
                <span className="font-extrabold text-base">→</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("found");
                  const el = document.getElementById("recently-reported");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-black/40 hover:bg-black/60 border border-white/30 text-white font-semibold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm transition"
              >
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
                  <path strokeLinecap="round" d="M16 16L20 20" stroke="currentColor" strokeWidth={2} />
                </svg>
                <span>Explore Found Items</span>
              </button>
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
            {/* Floating Speech Bubble: Item safely returned */}
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
                  src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80"
                  alt="Recently found keys"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-3 px-1">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Central Library</span>
                </div>

                <button
                  onClick={() => setClaimingItem(INITIAL_ITEMS[4])}
                  className="mt-3 w-full bg-slate-50 hover:bg-[#d4f938] hover:text-slate-950 border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition shadow-xs"
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
              placeholder="Search for an item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
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
              showToast(`Showing results for "${searchQuery || "all items"}"`);
            }}
            className="w-full md:w-auto bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
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
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${activeTab === "all"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveTab("lost")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${activeTab === "lost"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Lost Items
                </button>
                <button
                  onClick={() => setActiveTab("found")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${activeTab === "found"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Found Items
                </button>
              </div>
            </div>

            {/* View All link */}
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedCampus("All Campuses");
                showToast("Viewing all campus reports");
              }}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 group transition"
            >
              <span>View all</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
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
                className="mt-3 text-xs font-bold text-slate-900 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Container with Badge */}
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="hidden w-full h-full">
                        <FallbackThumbnail title={item.title} />
                      </div>

                      {/* Type Badge (Lost = soft sky blue, Found = soft lime green) */}
                      <span
                        className={`absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${item.type === "lost"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-[#e2f9d8] text-[#2d6a22]"
                          }`}
                      >
                        {item.type === "lost" ? "Lost" : "Found"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mt-3 px-1">
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-black">
                        {item.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-2.5 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth={2} />
                          </svg>
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dark Pill CTA Button */}
                  <div className="mt-4 px-1 pb-1">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full bg-[#0c242b] hover:bg-[#163d47] text-white py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>View details</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* === SECTION 2: HOW FINDIT WORKS === */}
        <section id="how-it-works" className="pt-4 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-10">
            How FindIt works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f8dc] text-slate-900 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">1. Report</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Quickly report your lost or found item with simple details.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f8dc] text-slate-900 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
                  <path strokeLinecap="round" d="M16 16L20 20" stroke="currentColor" strokeWidth={2} />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">2. Discover</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Browse items or get notified if someone finds your lost item.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f8dc] text-slate-900 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-1.106l-3.5-7A2 2 0 017.746 10H10V5a2 2 0 012-2h0a2 2 0 012 2v5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">3. Reconnect</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Get your item back safely and easily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION 3: TRUST & SAFETY BANNER === */}
        <section className="pt-2">
          <div className="bg-[#e8f8dc] border border-lime-200/80 rounded-full py-3.5 px-6 flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-bold text-slate-850 shadow-xs">
            <span className="text-base">🛡️</span>
            <span>Your safety matters. We verify ownership before handing over any item.</span>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0b1c20] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Logo & Slogan */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#d4f938] flex items-center justify-center text-slate-900 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.8} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="6.5" stroke="currentColor" />
                    <path strokeLinecap="round" d="M16 16L21 21" stroke="currentColor" />
                  </svg>
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  FindIt
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
              <p className="text-xs text-slate-400">Lost &amp; Found, Made Simple.</p>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-7 text-xs font-semibold text-slate-300">
              <a href="#" className="hover:text-white transition">Home</a>
              <button onClick={() => setActiveTab("lost")} className="hover:text-white transition">Lost Items</button>
              <button onClick={() => setActiveTab("found")} className="hover:text-white transition">Found Items</button>
              <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
              <a href="#" className="hover:text-white transition">Dashboard</a>
              <a href="#" className="hover:text-white transition">FAQ</a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition" aria-label="Discord">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.893.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div>© 2026 FindIt. All rights reserved.</div>
            <div className="flex items-center gap-1 font-semibold text-slate-300">
              <span>Built for our campus community</span>
              <span>💚</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* --- MODAL 1: VIEW DETAILS MODAL --- */}
      {/* ======================================================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Header visual */}
            <div className="bg-slate-100 relative h-60 w-full overflow-hidden shrink-0">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-sm shadow-md transition z-10"
              >
                ✕
              </button>
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-md ${selectedItem.type === "lost"
                    ? "bg-sky-100 text-sky-800"
                    : "bg-[#e2f9d8] text-[#2d6a22]"
                  }`}
              >
                {selectedItem.type === "lost" ? "Lost Item" : "Found Item"}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {selectedItem.category} • {selectedItem.campus}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedItem.title}
                </h3>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">Campus Location:</strong> {selectedItem.location} ({selectedItem.campus})
                </p>
                <p>
                  <strong className="text-slate-900">Date Logged:</strong> {selectedItem.date}
                </p>
                <p>
                  <strong className="text-slate-900">Status:</strong>{" "}
                  <span className="text-emerald-700 font-semibold">{selectedItem.status}</span>
                </p>
                {selectedItem.reporter && (
                  <p>
                    <strong className="text-slate-900">Reported By:</strong> {selectedItem.reporter}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Description
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    showToast("Shareable item link copied to clipboard!");
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition"
                >
                  Share Link
                </button>

                {selectedItem.type === "found" ? (
                  <button
                    onClick={() => {
                      const itm = selectedItem;
                      setSelectedItem(null);
                      setClaimingItem(itm);
                    }}
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4f938] hover:bg-[#c2f32e] rounded-full transition shadow-sm"
                  >
                    Claim This Item
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      showToast("Owner notified! Campus Security will verify your message.");
                      setSelectedItem(null);
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0c242b] hover:bg-[#163d47] rounded-full transition shadow-sm"
                  >
                    I Found This Item
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL 2: CLAIM ITEM MODAL --- */}
      {/* ======================================================== */}
      {claimingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Verify &amp; Claim Item
                </h3>
                <button
                  onClick={() => setClaimingItem(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </button>
              </div>

              {claimSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#d4f938] text-slate-950 text-2xl font-bold flex items-center justify-center mx-auto shadow-sm">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Verification Request Sent
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Your claim for &quot;{claimingItem.title}&quot; is now pending verification. Check your student email for pickup instructions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="mt-4 space-y-4">
                  {/* Selected Item Preview */}
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <img
                      src={claimingItem.imageUrl}
                      alt={claimingItem.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {claimingItem.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {claimingItem.location} • {claimingItem.campus}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Secret Identifying Details *
                    </label>
                    <textarea
                      required
                      placeholder="e.g. Serial numbers, secret keychain attachments, specific scratches, lock screen background..."
                      rows={3}
                      value={claimProof}
                      onChange={(e) => setClaimProof(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Campus Student Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@university.edu"
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setClaimingItem(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4f938] hover:bg-[#c2f32e] rounded-full transition shadow-sm"
                    >
                      Submit Claim
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL 3: REPORT LOST/FOUND ITEM WITH PHOTO UPLOAD --- */}
      {/* ======================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-slate-900">
                Publish a Campus Report
              </h3>
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setNewPhoto(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Lost / Found Toggle */}
              <div className="p-1 bg-slate-100 rounded-xl flex">
                <button
                  type="button"
                  onClick={() => setNewType("lost")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${newType === "lost"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("found")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${newType === "found"
                      ? "bg-[#0c242b] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Found Something
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony WH-1000XM4, Blue College Backpack..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="ID Cards">ID Cards</option>
                      <option value="Wallets">Wallets</option>
                      <option value="Bottles">Bottles</option>
                      <option value="Keys">Keys</option>
                      <option value="Bags">Bags</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Campus
                    </label>
                    <select
                      value={newCampus}
                      onChange={(e) => setNewCampus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                    >
                      <option value="Central Campus">Central Campus</option>
                      <option value="North Campus">North Campus</option>
                      <option value="South Campus">South Campus</option>
                      <option value="West Campus">West Campus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Campus Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central Library 2nd Floor, Main Cafeteria..."
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Photo Input (Drag & Drop or File Picker) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Photo of {newType === "found" ? "Found Item" : "Lost Item"}
                      {newType === "found" && (
                        <span className="ml-1 text-[10px] text-[#2d6a22] font-semibold bg-[#e2f9d8] px-1.5 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </label>
                    {newPhoto && (
                      <button
                        type="button"
                        onClick={() => setNewPhoto(null)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-medium"
                      >
                        ✕ Remove photo
                      </button>
                    )}
                  </div>

                  {newPhoto ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                      <img
                        src={newPhoto}
                        alt="Uploaded preview"
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label
                          htmlFor="change-photo-input"
                          className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md cursor-pointer hover:bg-slate-100 transition"
                        >
                          Change Photo
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewPhoto(null)}
                          className="bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-rose-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        id="change-photo-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <label
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center ${isDragging
                          ? "border-[#d4f938] bg-[#d4f938]/10 scale-[1.01]"
                          : "border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/70"
                        }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 mb-1.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        Upload item photo or drag and drop
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </label>
                  )}

                  {newType === "found" && (
                    <p className="mt-1.5 text-[11px] text-slate-400 leading-normal">
                      🔒 Tip: Do not photograph secret ID codes or serial numbers so the rightful owner can verify them.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe color, brand, condition, or other details..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReportModalOpen(false);
                      setNewPhoto(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4f938] hover:bg-[#c2f32e] rounded-full transition shadow-sm"
                  >
                    Publish Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
