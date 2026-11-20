"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useItems } from "../context/ItemsContext";

export default function HowItWorksPage() {
  const { openReportModal } = useItems();
  const [activeWorkflow, setActiveWorkflow] = useState<"lost" | "found">("lost");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How long does Campus Security hold found items?",
      a: "According to university regulations, items are held securely in custody for 90 days. High-value electronics and wallets are retained indefinitely in the campus safe until claimed or turned over to local authorities.",
    },
    {
      q: "What proof is required to verify ownership of electronics or wallets?",
      a: "You will be asked to provide non-public identifying details: unlocking the device with your passcode or biometric, providing the device IMEI/serial number, describing lock-screen wallpaper, or naming cards/contents inside a wallet.",
    },
    {
      q: "Is my personal contact information displayed publicly?",
      a: "No! Only authorized campus staff and security officers see your full student email and contact details. Public listings show only your first name and department, keeping you safe from spam or unwanted contact.",
    },
    {
      q: "Can a friend pick up my item for me?",
      a: "Yes, provided you submit an authorization ticket through the Dashboard with your friend's Student ID number and legal name. They must present their valid Campus ID upon arrival.",
    },
    {
      q: "Where should I take an item if I find it outside desk operating hours?",
      a: "Campus Security Headquarters (Central Administration Building Ground Floor) is open 24 hours a day, 7 days a week, 365 days a year.",
    },
  ];

  const custodyHubs = [
    {
      name: "Campus Security HQ",
      campus: "Central Campus",
      location: "Admin Building, Room 104 (Ground Floor)",
      hours: "24/7 All Year Round",
      phone: "(555) 019-2834",
      type: "Primary Custody & Safe",
      tagColor: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "Central Library Desk",
      campus: "Central Campus",
      location: "Library Main Atrium, 1st Floor",
      hours: "Mon – Sun: 8:00 AM – 11:00 PM",
      phone: "(555) 019-4501",
      type: "Books, Electronics & IDs",
      tagColor: "bg-sky-100 text-sky-800",
    },
    {
      name: "Engineering Block Office",
      campus: "North Campus",
      location: "Hall B, Student Services Office 210",
      hours: "Mon – Fri: 8:30 AM – 5:30 PM",
      phone: "(555) 019-6720",
      type: "Tech & Equipment",
      tagColor: "bg-purple-100 text-purple-800",
    },
    {
      name: "Sports Complex Reception",
      campus: "West Campus",
      location: "Athletics Lobby, Gate 2",
      hours: "Mon – Sat: 7:00 AM – 10:00 PM",
      phone: "(555) 019-8902",
      type: "Bottles, Bags & Gear",
      tagColor: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
      {/* Header Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#d4f938]/20 border border-[#d4f938]/40 px-4 py-1.5 rounded-full text-xs font-bold text-slate-900">
          <span>✨</span>
          <span>Official Campus Lost &amp; Found Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How FindIt Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          A transparent, secure, and student-powered lost and found network connecting over 10,000 campus members across 4 main academic campus zones.
        </p>

        {/* Workflow Switcher Tabs */}
        <div className="pt-4 flex justify-center">
          <div className="bg-slate-100 p-1.5 rounded-full inline-flex border border-slate-200">
            <button
              onClick={() => setActiveWorkflow("lost")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeWorkflow === "lost"
                  ? "bg-[#0c242b] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              If You Lost Something
            </button>
            <button
              onClick={() => setActiveWorkflow("found")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeWorkflow === "found"
                  ? "bg-[#0c242b] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              If You Found Something
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      {activeWorkflow === "lost" ? (
        <section className="space-y-8 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Recovering Your Missing Property in 4 Easy Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Follow these simple guidelines to maximize the chance of getting your item back.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-lg font-black mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Search Found Registry</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  First, browse the live <Link href="/found-items" className="text-sky-700 font-bold underline">Found Items Directory</Link>. Items turned into campus security or library staff appear here within minutes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                Tip: Filter by campus building for faster results.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#e8f8dc] text-[#2d6a22] flex items-center justify-center text-lg font-black mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">File a Lost Report</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  If your item isn&apos;t listed yet, click &quot;Report an Item&quot;. Specify the approximate building, room number, date, and general description with a reference photo.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                Broadcasts instantly across student and staff channels.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-lg font-black mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Submit Verification Claim</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  When you spot your item in the registry, click &quot;Claim&quot; and input secret identifiers (lock passcode, unique stickers, internal engravings, or scratches).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                Keeps your property safe from false claimants.
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-black mb-4">
                  4
                </div>
                <h3 className="text-base font-bold text-slate-900">Pickup at Security Desk</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Once your claim is approved, you will receive an official pickup pass email. Bring your Campus Student ID to the designated desk and collect your belonging!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                100% verified campus handoff protocol.
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => openReportModal("lost")}
              className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-7 py-3 rounded-full text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              Report a Lost Item Now →
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-8 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Found Something on Campus? How to Safely Return It
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Thank you for being a responsible community member. Here is how to handle found items responsibly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-black mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Take a Safe Photo</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Take a clear photo of the item. Do not reveal private serial numbers, bank card numbers, or dorm room numbers so the rightful owner can verify them later.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                Protect sensitive student data.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#d4f938] text-slate-950 flex items-center justify-center text-lg font-black mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Publish Found Report</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Post it on FindIt with the specific campus block and spot where you discovered it (e.g. Science Library, 2nd Floor Carrel).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                Allows owner to see it immediately online.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-lg font-black mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Drop at Official Desk</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Turn the item over to the nearest designated Help Desk (Library Desk, Security Desk, or Athletic Reception). The staff will register custody.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                Secure holding in locked campus vaults.
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-lg font-black mb-4">
                  4
                </div>
                <h3 className="text-base font-bold text-slate-900">Earn Community Karma</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Once the item is reunited with its owner, your dashboard will reflect a successful return, earning you campus good citizen recognition!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                Building a more trustworthy campus.
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => openReportModal("found")}
              className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-7 py-3 rounded-full text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              Report a Found Item Now →
            </button>
          </div>
        </section>
      )}

      {/* Campus Custody Desks Directory */}
      <section className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[#0c242b] text-xs font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              Physical Drop-off &amp; Collection Points
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Official Campus Help Desks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Bring found items or pick up claimed property at any of these staffed locations:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {custodyHubs.map((hub) => (
            <div
              key={hub.name}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${hub.tagColor}`}>
                    {hub.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{hub.campus}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{hub.name}</h3>
                <p className="text-xs text-slate-600 mt-1.5 flex items-start gap-1.5">
                  <span className="shrink-0">📍</span>
                  <span>{hub.location}</span>
                </p>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">⏰ Hours:</span>
                    <span>{hub.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">📞 Phone:</span>
                    <span>{hub.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Staffed Desk
                </span>
                <span className="text-slate-400 text-[11px]">ID Required</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-[#0c242b] text-xs font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
              Campus Lost &amp; Found Policies
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Got questions about recovery, security, or campus regulations? Find your answers below.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-black cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-lg text-slate-400 font-normal">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <div className="bg-[#0c242b] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
          Ready to find what you lost or report a found item?
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
          Every item matters. Help us keep our campus community supportive and connected.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openReportModal("lost")}
            className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            Report an Item Now
          </button>
          <Link
            href="/dashboard"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition"
          >
            Open My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
