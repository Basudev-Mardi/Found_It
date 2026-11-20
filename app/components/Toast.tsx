"use client";

import React from "react";
import { useItems } from "../context/ItemsContext";

export default function Toast() {
  const { toast } = useItems();

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      className={`fixed top-5 right-5 z-50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 animate-bounce ${
        isError
          ? "bg-rose-950 border border-rose-500/50 text-rose-100"
          : "bg-[#0c242b] border border-[#d4f938]/30 text-white"
      }`}
    >
      <div
        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
          isError ? "bg-rose-500 animate-ping" : "bg-[#d4f938]"
        }`}
      />
      <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
    </div>
  );
}
