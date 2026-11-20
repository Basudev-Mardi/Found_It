"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useItems } from "../context/ItemsContext";
import ItemCard from "../components/ItemCard";

export default function DashboardPage() {
  const { items, openReportModal, markRecovered, verifyClaim, setSelectedItem, showToast } = useItems();

  const [activeTab, setActiveTab] = useState<"lost" | "found" | "claims" | "activity">("lost");

  // User-reported lost items
  const myLostItems = useMemo(() => {
    return items.filter((item) => item.type === "lost" && item.isUserReported);
  }, [items]);

  // User-reported found items
  const myFoundItems = useMemo(() => {
    return items.filter((item) => item.type === "found" && item.isUserReported);
  }, [items]);

  // Items with pending claims or user claimed
  const myClaims = useMemo(() => {
    return items.filter((item) => item.status === "Claim Pending" || item.claimantEmail);
  }, [items]);

  const totalReported = myLostItems.length + myFoundItems.length;
  const recoveredCount = items.filter((item) => item.status === "Recovered" && item.isUserReported).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* User Profile & Dashboard Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0c242b] to-[#1c5565] text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
            EK
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Ethan K.
              </h1>
              <span className="bg-[#e8f8dc] text-[#2d6a22] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-lime-300">
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Student ID: <span className="font-mono font-semibold text-slate-700">#CS-2024-9182</span> • Central Campus • Arts &amp; Sciences
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Campus Email: ethan.k@campus.edu
            </p>
          </div>
        </div>

        {/* Quick Report Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openReportModal("lost")}
            className="bg-[#0c242b] hover:bg-[#163d47] text-white font-bold px-4 sm:px-5 py-2.5 rounded-full text-xs transition cursor-pointer shadow-xs active:scale-95"
          >
            + Report Lost Item
          </button>
          <button
            onClick={() => openReportModal("found")}
            className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-4 sm:px-5 py-2.5 rounded-full text-xs transition cursor-pointer shadow-xs active:scale-95"
          >
            + Report Found Item
          </button>
          <button
            onClick={() => showToast("Printable campus flyer generated!")}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-full text-xs transition cursor-pointer"
          >
            🖨️ Print Notice Flyer
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>My Active Reports</span>
            <span>📋</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {totalReported}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {myLostItems.length} lost, {myFoundItems.length} found logged
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Claims Under Review</span>
            <span>⏳</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {myClaims.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Awaiting campus security sign-off
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Reunited Belongings</span>
            <span>🎉</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {recoveredCount + 1}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Successfully returned to owners
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Campus Karma</span>
            <span>⭐</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0c242b] mt-2">
            180 pts
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Top 5% helpful campus member
          </p>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("lost")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
              activeTab === "lost"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            My Lost Reports ({myLostItems.length})
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
              activeTab === "found"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            My Found Reports ({myFoundItems.length})
          </button>
          <button
            onClick={() => setActiveTab("claims")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
              activeTab === "claims"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Claim Requests &amp; Pickup Passes ({myClaims.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
              activeTab === "activity"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Live Campus Activity Feed
          </button>
        </div>
      </div>

      {/* Tab 1: My Lost Reports */}
      {activeTab === "lost" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Items You Reported Missing
            </h2>
            <button
              onClick={() => openReportModal("lost")}
              className="text-xs font-bold text-[#0c242b] hover:underline cursor-pointer"
            >
              + File another lost report
            </button>
          </div>

          {myLostItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300">
              <p className="text-sm font-semibold text-slate-600">
                You haven&apos;t filed any missing item reports yet.
              </p>
              <button
                onClick={() => openReportModal("lost")}
                className="mt-3 px-5 py-2 text-xs font-bold bg-[#d4f938] text-slate-950 rounded-full"
              >
                Report a Lost Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myLostItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Recovered"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Claim Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-sky-100 text-sky-800"
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>

                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 mb-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400 font-medium">
                      📍 {item.location} ({item.campus})
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-bold text-slate-700 hover:text-slate-950 cursor-pointer"
                    >
                      View Details →
                    </button>

                    {item.status !== "Recovered" && (
                      <button
                        onClick={() => markRecovered(item.id)}
                        className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full transition cursor-pointer"
                      >
                        ✓ Mark Found
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Found Reports */}
      {activeTab === "found" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Items You Found &amp; Registered
            </h2>
            <button
              onClick={() => openReportModal("found")}
              className="text-xs font-bold text-[#0c242b] hover:underline cursor-pointer"
            >
              + File another found report
            </button>
          </div>

          {myFoundItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300">
              <p className="text-sm font-semibold text-slate-600">
                You haven&apos;t registered any found items yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                If you pick up a lost water bottle, keys, or cards on campus, log it here to help the owner!
              </p>
              <button
                onClick={() => openReportModal("found")}
                className="mt-3 px-5 py-2 text-xs font-bold bg-[#d4f938] text-slate-950 rounded-full cursor-pointer"
              >
                Report a Found Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myFoundItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e2f9d8] text-[#2d6a22]">
                        {item.status}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>

                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 mb-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400 font-medium">
                      📍 {item.location} ({item.campus})
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-bold text-slate-700 hover:text-slate-950 cursor-pointer"
                    >
                      View Details →
                    </button>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Registered in Registry
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Claims & Pickup Passes */}
      {activeTab === "claims" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Claim Verification Tickets &amp; Collection Passes
              </h2>
              <p className="text-xs text-slate-500">
                All submitted ownership claims are routed to Campus Staff Officer Nikhil Minz for verification.
              </p>
            </div>
          </div>

          {/* Official Campus Staff Verification Desk Banner */}
          <div className="bg-gradient-to-r from-[#0c242b] via-[#163f4b] to-[#0c242b] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#d4f938] text-slate-950 flex items-center justify-center text-xl font-black shrink-0 shadow-sm">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#d4f938]">
                    Campus Staff Verification Officer Desk
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Designated Verifier: <strong className="text-white">Officer Nikhil Minz</strong> (
                  <a href="mailto:nikhilminz04@gmail.com" className="text-[#d4f938] underline font-mono">
                    nikhilminz04@gmail.com
                  </a>
                  )
                </p>
                <p className="text-[11px] text-slate-300">
                  Every claim is assigned to this email. You can verify proof directly from here or through Gmail.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href="mailto:nikhilminz04@gmail.com?subject=Campus%20Lost%20and%20Found%20Claims%20Verification%20Review"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5"
              >
                <span>📧 Open Staff Inbox</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {myClaims.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Verification Pending
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Held at: <strong className="text-slate-800">{item.location} ({item.campus})</strong>
                    </p>
                    {item.claimantEmail && (
                      <p className="text-[11px] text-slate-600 mt-1">
                        <strong>Claimant:</strong>{" "}
                        <span className="font-mono text-slate-800">{item.claimantEmail}</span>
                      </p>
                    )}
                    {item.claimantProof && (
                      <p className="text-[11px] text-slate-500 mt-0.5 italic line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        &quot;{item.claimantProof}&quot;
                      </p>
                    )}
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                      🛡️ Assigned Staff Verifier: nikhilminz04@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <a
                    href={`mailto:${item.claimantEmail || "nikhilminz04@gmail.com"}?subject=FoundIt%20Claim%20Verification%20for%20${encodeURIComponent(
                      item.title
                    )}&body=Hello,%0D%0A%0D%0AThis%20is%20Campus%20Staff%20Officer%20Nikhil%20Minz%20(nikhilminz04@gmail.com)%20regarding%20your%20claim%20for%20"${encodeURIComponent(
                      item.title
                    )}".%0D%0A%0D%0APlease%20provide%20any%20additional%20verification%20photos%20or%20serial%20numbers%20so%20we%20can%20authorize%20your%20pickup%20pass.`}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition flex items-center gap-1"
                  >
                    <span>📧 Verify via Email</span>
                  </a>

                  <button
                    onClick={() => verifyClaim(item.id, "approve")}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>✓ Approve Claim</span>
                  </button>

                  <button
                    onClick={() => verifyClaim(item.id, "reject")}
                    className="px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full transition cursor-pointer"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}

            {myClaims.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300">
                <p className="text-sm font-semibold text-slate-600">
                  You have no pending claims or pickup passes at this time.
                </p>
                <Link
                  href="/found-items"
                  className="mt-3 inline-block px-5 py-2 text-xs font-bold bg-[#0c242b] text-white rounded-full"
                >
                  Search Found Items to Claim
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Live Campus Activity Feed */}
      {activeTab === "activity" && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Live Campus Activity Feed
            </h2>
            <p className="text-xs text-slate-500">
              Real-time updates of lost reports, found submissions, and reunions across all campuses.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 divide-y divide-slate-100">
            <div className="py-3 flex items-start gap-3">
              <span className="text-base">🎉</span>
              <div>
                <p className="text-xs sm:text-sm text-slate-800">
                  <strong>Space Gray MacBook Air</strong> was successfully returned to David R. at Central Campus Security Desk.
                </p>
                <span className="text-[10px] text-slate-400">10 minutes ago • Central Campus</span>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3">
              <span className="text-base">📦</span>
              <div>
                <p className="text-xs sm:text-sm text-slate-800">
                  <strong>Toyota Smart Key Fob</strong> was turned in by Parking Officer at South Campus Gate B.
                </p>
                <span className="text-[10px] text-slate-400">42 minutes ago • South Campus</span>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3">
              <span className="text-base">🔍</span>
              <div>
                <p className="text-xs sm:text-sm text-slate-800">
                  New claim verification submitted for <strong>AirPods Pro with Wireless Case</strong> in Lecture Hall 4.
                </p>
                <span className="text-[10px] text-slate-400">1 hour ago • North Campus</span>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3">
              <span className="text-base">🛡️</span>
              <div>
                <p className="text-xs sm:text-sm text-slate-800">
                  Campus Security Desk verified and secured <strong>Bike Key with Keychain</strong> found at Central Library.
                </p>
                <span className="text-[10px] text-slate-400">3 hours ago • Central Library</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campus Help & Emergency Contact Widget */}
      <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            📞
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Campus Security Dispatch &amp; Lost Property Desk
            </h4>
            <p className="text-xs text-slate-500">
              Emergency assistance, after-hours pickup, or building lock assistance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="tel:5550192834"
            className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-full border border-slate-300 shadow-2xs hover:bg-slate-50"
          >
            (555) 019-2834
          </a>
          <Link
            href="/how-it-works"
            className="px-4 py-2 bg-[#0c242b] text-white font-bold text-xs rounded-full shadow-xs hover:bg-[#163d47]"
          >
            Help Centers
          </Link>
        </div>
      </div>
    </div>
  );
}
