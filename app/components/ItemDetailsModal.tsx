"use client";

import React from "react";
import { useItems } from "../context/ItemsContext";

export default function ItemDetailsModal() {
  const { selectedItem, setSelectedItem, setClaimingItem, showToast, markRecovered } = useItems();

  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header image visual */}
        <div className="bg-slate-100 relative h-64 w-full overflow-hidden shrink-0">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-sm shadow-md transition z-10 cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={selectedItem.imageUrl}
            alt={selectedItem.title}
            className="w-full h-full object-cover"
          />
          <span
            className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
              selectedItem.type === "lost"
                ? "bg-sky-100 text-sky-800"
                : "bg-[#e2f9d8] text-[#2d6a22]"
            }`}
          >
            {selectedItem.type === "lost" ? "Lost Item" : "Found Item"}
          </span>

          <span
            className={`absolute bottom-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
              selectedItem.status === "Recovered"
                ? "bg-emerald-600 text-white"
                : selectedItem.status === "Claim Pending"
                ? "bg-amber-500 text-white"
                : "bg-slate-900/80 text-white backdrop-blur-xs"
            }`}
          >
            {selectedItem.status}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>{selectedItem.category}</span>
              <span>{selectedItem.campus}</span>
            </div>
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
              <span className={`font-bold ${
                selectedItem.status === "Recovered"
                  ? "text-emerald-700"
                  : selectedItem.status === "Claim Pending"
                  ? "text-amber-700"
                  : "text-slate-800"
              }`}>
                {selectedItem.status}
              </span>
            </p>
            {selectedItem.reporter && (
              <p>
                <strong className="text-slate-900">Reported By:</strong> {selectedItem.reporter}
              </p>
            )}
            {selectedItem.contactEmail && (
              <p>
                <strong className="text-slate-900">Campus Contact:</strong> {selectedItem.contactEmail}
              </p>
            )}
            {(selectedItem.status === "Claim Pending" || selectedItem.staffReviewerEmail) && (
              <p>
                <strong className="text-slate-900">Staff Verifier:</strong>{" "}
                <a
                  href={`mailto:${selectedItem.staffReviewerEmail || "nikhilminz04@gmail.com"}`}
                  className="text-emerald-700 underline font-semibold"
                >
                  {selectedItem.staffReviewerEmail || "nikhilminz04@gmail.com"}
                </a>
              </p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Detailed Description
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedItem.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast("Item report link copied to clipboard!");
              }}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer"
            >
              Share Link
            </button>

            {selectedItem.status !== "Recovered" && (
              <button
                onClick={() => {
                  markRecovered(selectedItem.id);
                  setSelectedItem({ ...selectedItem, status: "Recovered" });
                }}
                className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-full transition cursor-pointer"
              >
                Mark as Recovered
              </button>
            )}

            {selectedItem.type === "found" ? (
              <button
                onClick={() => {
                  const itm = selectedItem;
                  setSelectedItem(null);
                  setClaimingItem(itm);
                }}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4f938] hover:bg-[#c2f32e] rounded-full transition shadow-sm cursor-pointer"
              >
                Claim This Item
              </button>
            ) : (
              <button
                onClick={() => {
                  showToast("Owner notified! Campus Security will verify your message.");
                  setSelectedItem(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0c242b] hover:bg-[#163d47] rounded-full transition shadow-sm cursor-pointer"
              >
                I Found This Item
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
