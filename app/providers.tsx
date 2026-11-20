"use client";

import React from "react";
import { ItemsProvider } from "./context/ItemsContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ItemDetailsModal from "./components/ItemDetailsModal";
import ClaimModal from "./components/ClaimModal";
import ReportModal from "./components/ReportModal";
import Toast from "./components/Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ItemsProvider>
      <div className="min-h-screen flex flex-col bg-[#fcfdfd] text-slate-800 font-sans selection:bg-[#d4f938] selection:text-slate-950">
        <Toast />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <ItemDetailsModal />
        <ClaimModal />
        <ReportModal />
      </div>
    </ItemsProvider>
  );
}
