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
      }, 5000);
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
                Staff Verifier: <span className="font-semibold text-emerald-700">nikhilminz04@gmail.com</span>
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
            <div className="py-6 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#d4f938] text-slate-950 text-2xl font-bold flex items-center justify-center mx-auto shadow-sm">
                ✓
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Claim Sent to Staff Verifier!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your claim for &quot;{claimingItem.title}&quot; has been recorded and routed to Campus Staff Officer{" "}
                <strong className="text-slate-900">Nikhil Minz</strong> (
                <a href="mailto:nikhilminz04@gmail.com" className="text-emerald-700 underline font-semibold">
                  nikhilminz04@gmail.com
                </a>
                ).
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={`mailto:nikhilminz04@gmail.com?subject=Claim%20Verification%20for%20${encodeURIComponent(
                    claimingItem.title
                  )}&body=Hello%20Campus%20Staff%20Officer%20Nikhil,%0D%0A%0D%0AI%20submitted%20an%20ownership%20claim%20for%20"${encodeURIComponent(
                    claimingItem.title
                  )}"%20(Item%20ID:%20${claimingItem.id}).%0D%0A%0D%0AMy%20Email:%20${encodeURIComponent(
                    claimEmail
                  )}%0D%0AIdentifying%20Proof:%20${encodeURIComponent(
                    claimProof
                  )}%0D%0A%0D%0APlease%20verify%20my%20claim%20and%20issue%20the%20pickup%20pass.`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0c242b] hover:bg-[#163d47] text-white text-xs font-bold px-4 py-2.5 rounded-full transition shadow-xs"
                >
                  <span>📧 Email Staff (nikhilminz04@gmail.com)</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setClaimingItem(null);
                    setClaimProof("");
                    setClaimEmail("");
                    setErrors({});
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Done
                </button>
              </div>
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

              {/* Staff Verifier Badge Info */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-emerald-950">
                <span className="text-base shrink-0">🛡️</span>
                <div className="text-[11px] leading-relaxed">
                  <strong>Campus Staff Reviewer:</strong> Claims will be forwarded directly to Officer Nikhil (
                  <a href="mailto:nikhilminz04@gmail.com" className="font-bold underline text-emerald-800">
                    nikhilminz04@gmail.com
                  </a>
                  ) to verify your proof before handing over the item.
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
