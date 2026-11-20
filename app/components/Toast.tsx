"use client";

import React from "react";
import { useItems } from "../context/ItemsContext";

export default function Toast() {
  const { toastMessage } = useItems();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-[#0c242b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#d4f938]/30 flex items-center gap-3 animate-bounce">
      <div className="w-2.5 h-2.5 rounded-full bg-[#d4f938] shrink-0" />
      <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
    </div>
  );
}
