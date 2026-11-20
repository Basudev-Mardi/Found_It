"use client";

import React, { useState } from "react";
import { useItems } from "../context/ItemsContext";

export default function ClaimModal() {
  const { claimingItem, setClaimingItem, claimItem } = useItems();
  const [claimProof, setClaimProof] = useState("");
  const [claimEmail, setClaimEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!claimingItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimProof || !claimEmail) return;

    claimItem(claimingItem.id, claimProof, claimEmail);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setClaimingItem(null);
      setClaimProof("");
      setClaimEmail("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Verify &amp; Claim Item
            </h3>
            <button
              onClick={() => setClaimingItem(null)}
              className="text-slate-400 hover:text-slate-600 text-sm w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#d4f938] text-slate-950 text-2xl font-bold flex items-center justify-center mx-auto shadow-sm">
                ✓
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Verification Request Sent!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your claim for &quot;{claimingItem.title}&quot; is now pending verification. Check your student email ({claimEmail}) for pickup instructions and verification time.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Selected Item Preview */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
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
                  placeholder="Describe unique characteristics not visible in the public photo (e.g. Serial numbers, keychain accessories, stickers, lock screen wallpaper, specific scratches)..."
                  rows={3}
                  value={claimProof}
                  onChange={(e) => setClaimProof(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Campus Security will match these details before releasing the item.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Student / Staff Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@university.edu"
                  value={claimEmail}
                  onChange={(e) => setClaimEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClaimingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4f938] hover:bg-[#c2f32e] rounded-full transition shadow-sm cursor-pointer"
                >
                  Submit Claim Verification
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
