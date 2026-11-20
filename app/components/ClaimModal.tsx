"use client";

import React, { useState } from "react";
import { useItems } from "../context/ItemsContext";

export default function ClaimModal() {
  const { claimingItem, setClaimingItem, claimItem } = useItems();
  const [claimProof, setClaimProof] = useState("");
  const [claimEmail, setClaimEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  if (!claimingItem) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!claimProof.trim()) {
      errs.proof = "Identifying details are required.";
    } else if (claimProof.trim().length < 5) {
      errs.proof = "Please provide more details (at least 5 characters).";
    }

    if (!claimEmail.trim()) {
      errs.email = "University email address is required.";
    } else if (!emailRegex.test(claimEmail.trim())) {
      errs.email = "Please enter a valid email (e.g. name@university.edu).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await claimItem(claimingItem.id, claimProof.trim(), claimEmail.trim());
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setClaimingItem(null);
        setClaimProof("");
        setClaimEmail("");
        setErrors({});
        setApiError(null);
      }, 2500);
    } else {
      setApiError(result.error || "Failed to submit claim verification request.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Verify &amp; Claim Item
              </h3>
              <p className="text-[11px] text-slate-500">
                Verifications are processed by Campus Security
              </p>
            </div>
            <button
              onClick={() => {
                setClaimingItem(null);
                setErrors({});
                setApiError(null);
              }}
              className="text-slate-400 hover:text-slate-600 text-sm w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#d4f938] text-slate-950 text-2xl font-bold flex items-center justify-center mx-auto shadow-sm">
                ✓
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Verification Request Sent!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your claim for &quot;{claimingItem.title}&quot; has been recorded on the backend API. Check your email ({claimEmail}) for security instructions.
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

              {/* Proof textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Secret Identifying Details *
                  </label>
                  {errors.proof && (
                    <span className="text-[11px] text-rose-600 font-medium">{errors.proof}</span>
                  )}
                </div>
                <textarea
                  placeholder="Describe unique characteristics not visible in the public photo (e.g. Serial numbers, keychain accessories, stickers, lock screen wallpaper, specific scratches)..."
                  rows={3}
                  value={claimProof}
                  onChange={(e) => {
                    setClaimProof(e.target.value);
                    if (errors.proof) setErrors((p) => ({ ...p, proof: "" }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:outline-none focus:bg-white transition ${
                    errors.proof
                      ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                      : "border-slate-200 focus:ring-[#0c242b]"
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Campus Security will match these details before releasing the item.
                </p>
              </div>

              {/* Email input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Campus Student / Staff Email *
                  </label>
                  {errors.email && (
                    <span className="text-[11px] text-rose-600 font-medium">{errors.email}</span>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="e.g. yourname@university.edu"
                  value={claimEmail}
                  onChange={(e) => {
                    setClaimEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:outline-none focus:bg-white transition ${
                    errors.email
                      ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                      : "border-slate-200 focus:ring-[#0c242b]"
                  }`}
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setClaimingItem(null);
                    setErrors({});
                    setApiError(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4f938] hover:bg-[#c2f32e] rounded-full transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying via API...</span>
                    </>
                  ) : (
                    <span>Submit Claim Verification</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
