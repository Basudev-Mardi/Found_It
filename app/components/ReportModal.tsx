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
  const [contactEmail, setContactEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isReportModalOpen) return null;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast("Photo must be less than 15MB", "error");
      return;
    }
    const compressed = await compressImage(file);
    if (compressed) {
      setPhoto(compressed);
      showToast("Photo attached & optimized!", "success");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 15 * 1024 * 1024) {
        showToast("Photo must be less than 15MB", "error");
        return;
      }
      const compressed = await compressImage(file);
      if (compressed) {
        setPhoto(compressed);
        showToast("Photo attached & optimized!", "success");
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!title.trim()) {
      errors.title = "Item title is required.";
    } else if (title.trim().length < 3) {
      errors.title = "Item title must be at least 3 characters long.";
    }

    if (!location.trim()) {
      errors.location = "Campus location is required.";
    } else if (location.trim().length < 2) {
      errors.location = "Please provide a specific location (e.g. Science Library 2nd floor).";
    }

    if (!description.trim()) {
      errors.description = "Item description is required.";
    } else if (description.trim().length < 5) {
      errors.description = "Description must be at least 5 characters long.";
    }

    if (contactEmail && !emailRegex.test(contactEmail.trim())) {
      errors.contactEmail = "Please enter a valid university email address.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      showToast("Please fill in all required fields marked with *", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await addItem({
        title: title.trim(),
        category,
        campus,
        location: location.trim(),
        description: description.trim(),
        type: reportModalType,
        imageUrl: photo || undefined,
        contactEmail: contactEmail.trim() || undefined,
      });

      if (result.success) {
        setIsReportModalOpen(false);
        setTitle("");
        setLocation("");
        setDescription("");
        setContactEmail("");
        setPhoto(null);
        setFormErrors({});
        setApiError(null);
      } else {
        const errorMsg = result.error || "Failed to submit report. Please review your input.";
        setApiError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred while publishing report.";
      setApiError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Publish a Campus Report
            </h3>
            <p className="text-xs text-slate-500">
              Stored directly in the campus backend database
            </p>
          </div>
          <button
            onClick={() => {
              setIsReportModalOpen(false);
              setPhoto(null);
              setFormErrors({});
              setApiError(null);
            }}
            className="text-slate-400 hover:text-slate-600 text-sm w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* API Server Error State Alert */}
          {apiError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          {/* Form Validation Error Alert */}
          {Object.keys(formErrors).length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
              <span className="text-sm shrink-0">⚠️</span>
              <div>
                <strong>Please complete required fields:</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[11px]">
                  {Object.values(formErrors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Lost / Found Toggle */}
          <div className="p-1 bg-slate-100 rounded-xl flex">
            <button
              type="button"
              onClick={() => {
                setReportModalType("lost");
                setFormErrors({});
              }}
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
              onClick={() => {
                setReportModalType("found");
                setFormErrors({});
              }}
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
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Item Title *
                </label>
                {formErrors.title && (
                  <span className="text-[11px] text-rose-600 font-medium">{formErrors.title}</span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. Sony WH-1000XM4, Blue Backpack, Toyota Key Fob..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (formErrors.title) setFormErrors((p) => ({ ...p, title: "" }));
                }}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:outline-none focus:bg-white transition ${
                  formErrors.title
                    ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                    : "border-slate-200 focus:ring-[#0c242b]"
                }`}
              />
            </div>

            {/* Category & Campus */}
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

            {/* Campus Location */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Specific Campus Location *
                </label>
                {formErrors.location && (
                  <span className="text-[11px] text-rose-600 font-medium">{formErrors.location}</span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. Central Library 2nd Floor, Main Cafeteria, Science Lab 204..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (formErrors.location) setFormErrors((p) => ({ ...p, location: "" }));
                }}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:outline-none focus:bg-white transition ${
                  formErrors.location
                    ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                    : "border-slate-200 focus:ring-[#0c242b]"
                }`}
              />
            </div>

            {/* Optional Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Contact Campus Email (Optional)
                </label>
                {formErrors.contactEmail && (
                  <span className="text-[11px] text-rose-600 font-medium">{formErrors.contactEmail}</span>
                )}
              </div>
              <input
                type="email"
                placeholder="student@university.edu"
                value={contactEmail}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  if (formErrors.contactEmail) setFormErrors((p) => ({ ...p, contactEmail: "" }));
                }}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:outline-none focus:bg-white transition ${
                  formErrors.contactEmail
                    ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                    : "border-slate-200 focus:ring-[#0c242b]"
                }`}
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
                    className="w-full h-40 object-cover"
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
                  <div className="w-9 h-9 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-[10px] text-slate-400">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </label>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Description *
                </label>
                {formErrors.description && (
                  <span className="text-[11px] text-rose-600 font-medium">{formErrors.description}</span>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="Describe color, brand, condition, unique markings, or surrounding circumstances..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (formErrors.description) setFormErrors((p) => ({ ...p, description: "" }));
                }}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:outline-none focus:bg-white transition ${
                  formErrors.description
                    ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                    : "border-slate-200 focus:ring-[#0c242b]"
                }`}
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsReportModalOpen(false);
                  setPhoto(null);
                  setFormErrors({});
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
                    <span>Publishing to API...</span>
                  </>
                ) : (
                  <span>Publish Report</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
