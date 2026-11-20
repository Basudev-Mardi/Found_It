"use client";

import React, { useState } from "react";
import { useItems } from "../context/ItemsContext";

export default function ReportModal() {
  const { isReportModalOpen, setIsReportModalOpen, reportModalType, setReportModalType, addItem, showToast } = useItems();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [campus, setCampus] = useState("Central Campus");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isReportModalOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("Photo must be less than 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      showToast("Photo attached successfully!");
    };
    reader.readAsDataURL(file);
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
        setPhoto(reader.result as string);
        showToast("Photo attached successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !description) return;

    addItem({
      title,
      category,
      campus,
      location,
      description,
      type: reportModalType,
      imageUrl: photo || undefined,
    });

    setIsReportModalOpen(false);
    setTitle("");
    setLocation("");
    setDescription("");
    setPhoto(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-slate-900">
            Publish a Campus Report
          </h3>
          <button
            onClick={() => {
              setIsReportModalOpen(false);
              setPhoto(null);
            }}
            className="text-slate-400 hover:text-slate-600 text-sm w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* Lost / Found Toggle */}
          <div className="p-1 bg-slate-100 rounded-xl flex">
            <button
              type="button"
              onClick={() => setReportModalType("lost")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                reportModalType === "lost"
                  ? "bg-[#0c242b] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Lost Something
            </button>
            <button
              type="button"
              onClick={() => setReportModalType("found")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                reportModalType === "found"
                  ? "bg-[#0c242b] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Found Something
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sony WH-1000XM4, Blue Backpack, Toyota Key Fob..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white cursor-pointer"
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
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white cursor-pointer"
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
                placeholder="e.g. Central Library 2nd Floor, Main Cafeteria, Science Lab 204..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
              />
            </div>

            {/* Photo Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Photo of {reportModalType === "found" ? "Found Item" : "Lost Item"}
                </label>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                  >
                    ✕ Remove photo
                  </button>
                )}
              </div>

              {photo ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                  <img
                    src={photo}
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
                      onClick={() => setPhoto(null)}
                      className="bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-rose-700 transition cursor-pointer"
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                    isDragging
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe color, brand, condition, unique markings, or surrounding circumstances..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0c242b] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setPhoto(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4f938] hover:bg-[#c2f32e] rounded-full transition shadow-sm cursor-pointer"
              >
                Publish Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
