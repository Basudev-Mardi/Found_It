"use client";

import React from "react";
import { Item, useItems } from "../context/ItemsContext";

interface ItemCardProps {
  item: Item;
  showClaimButton?: boolean;
}

export default function ItemCard({ item, showClaimButton = false }: ItemCardProps) {
  const { setSelectedItem, setClaimingItem } = useItems();

  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Image Container with Badges */}
        <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Fallback thumbnail */}
          <div className="hidden w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-400">
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[10px] text-center font-medium line-clamp-1">{item.title}</span>
          </div>

          {/* Type Badge (Lost vs Found) */}
          <span
            className={`absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
              item.type === "lost"
                ? "bg-sky-100 text-sky-800"
                : "bg-[#e2f9d8] text-[#2d6a22]"
            }`}
          >
            {item.type === "lost" ? "Lost" : "Found"}
          </span>

          {/* Status Badge if not Available */}
          {item.status !== "Available" && (
            <span
              className={`absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                item.status === "Recovered"
                  ? "bg-slate-900/80 text-emerald-400 backdrop-blur-xs"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {item.status}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mt-3 px-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
            <span>{item.category}</span>
            <span>{item.campus}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-black line-clamp-1">
            {item.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-2.5 flex items-center gap-2.5 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 truncate">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{item.location}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 shrink-0">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth={2} />
              </svg>
              <span>{item.date}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 px-1 pb-1 flex items-center gap-2">
        <button
          onClick={() => setSelectedItem(item)}
          className="flex-1 bg-[#0c242b] hover:bg-[#163d47] text-white py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <span>View details</span>
          <span>→</span>
        </button>

        {showClaimButton && item.type === "found" && item.status === "Available" && (
          <button
            onClick={() => setClaimingItem(item)}
            className="bg-[#d4f938] hover:bg-[#c2f32e] text-slate-950 px-3 py-2 rounded-full text-xs font-bold transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
            title="Claim This Item"
          >
            Claim
          </button>
        )}
      </div>
    </div>
  );
}
