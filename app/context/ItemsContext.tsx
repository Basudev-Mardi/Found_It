"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Item {
  id: string;
  title: string;
  category: string;
  campus: string;
  location: string;
  date: string;
  description: string;
  status: "Available" | "Claim Pending" | "Recovered";
  type: "lost" | "found";
  imageUrl: string;
  reporter?: string;
  contactEmail?: string;
  claimantProof?: string;
  claimantEmail?: string;
  staffReviewerEmail?: string;
  isUserReported?: boolean;
}

export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

export const INITIAL_ITEMS: Item[] = [
  {
    id: "item-1",
    title: "Wireless Headphones",
    category: "Electronics",
    campus: "North Campus",
    location: "Library",
    date: "Nov 19, 2026",
    description: "Matte black over-ear Bluetooth headphones with protective travel case left on 2nd floor study carrel.",
    status: "Available",
    type: "lost",
    imageUrl: "/images/wireless-headphones.jpg",
    reporter: "Ethan K. (Arts & Sciences)",
    contactEmail: "ethan.k@campus.edu",
    isUserReported: true,
  },
  {
    id: "item-2",
    title: "Student ID Card",
    category: "ID Cards",
    campus: "Central Campus",
    location: "Main Building",
    date: "Nov 18, 2026",
    description: "Official University Student ID card with blue campus lanyard found on 1st floor lobby table (student number ending in 8492).",
    status: "Claim Pending",
    type: "found",
    imageUrl: "/images/student-id-card.jpg",
    reporter: "Officer Nikhil Minz (Campus Security)",
    contactEmail: "nikhilminz04@gmail.com",
    claimantProof: "Student card ending with #8492, CS Dept with blue lanyard badge",
    claimantEmail: "alex.student@campus.edu",
    staffReviewerEmail: "nikhilminz04@gmail.com",
  },
  {
    id: "item-3",
    title: "Leather Wallet",
    category: "Wallets",
    campus: "South Campus",
    location: "Cafeteria",
    date: "Nov 17, 2026",
    description: "Black leather bifold wallet with contrast brown stitching. Important cards and transit pass inside.",
    status: "Available",
    type: "lost",
    imageUrl: "/images/leather-wallet.jpg",
    reporter: "Marcus L. (Economics)",
    contactEmail: "marcus.l@campus.edu",
    isUserReported: true,
  },
  {
    id: "item-4",
    title: "Stainless Steel Water Bottle",
    category: "Bottles",
    campus: "West Campus",
    location: "Sports Complex",
    date: "Nov 16, 2026",
    description: "Stainless steel 750ml insulated flask bottle with metallic matte sheen and silver cap. Left near bleachers.",
    status: "Available",
    type: "found",
    imageUrl: "/images/water-bottle.jpg",
    reporter: "Fitness Center Reception",
    contactEmail: "rec@campus.edu",
  },
  {
    id: "item-5",
    title: "Bike Key & Keychain",
    category: "Keys",
    campus: "Central Campus",
    location: "Central Library",
    date: "Nov 18, 2026",
    description: "Black motorcycle / bike ignition key with leather keychain and bike locker tag found at Central Library.",
    status: "Available",
    type: "found",
    imageUrl: "/images/bike-key.jpg",
    reporter: "Library 2nd Floor Desk",
    contactEmail: "library-desk@campus.edu",
  },
  {
    id: "item-6",
    title: "Blue College Backpack",
    category: "Bags",
    campus: "North Campus",
    location: "Engineering Block",
    date: "Nov 17, 2026",
    description: "Navy blue college backpack with 15-inch laptop sleeve, notebook and small tear near outer pocket zipper.",
    status: "Available",
    type: "lost",
    imageUrl: "/images/college-backpack.jpg",
    reporter: "Sophia T. (Computer Science)",
    contactEmail: "sophia.t@campus.edu",
  },
  {
    id: "item-7",
    title: "AirPods Pro with Wireless Case",
    category: "Electronics",
    campus: "North Campus",
    location: "Lecture Hall 4",
    date: "Nov 19, 2026",
    description: "White AirPods Pro case with small scratch on bottom hinge. Left on armrest seat 42B.",
    status: "Claim Pending",
    type: "found",
    imageUrl: "/images/airpods-pro.jpg",
    reporter: "Prof. Sanders Office",
    contactEmail: "sanders@campus.edu",
    claimantProof: "Engraving inside says 'Alex-2025' and matches serial number on my phone settings.",
    claimantEmail: "alex.student@campus.edu",
    staffReviewerEmail: "nikhilminz04@gmail.com",
  },
  {
    id: "item-8",
    title: "Silver Rim Prescription Glasses",
    category: "Other",
    campus: "South Campus",
    location: "Student Union Atrium",
    date: "Nov 19, 2026",
    description: "Ray-Ban round frame eyeglasses with thin silver rims inside a magnetic hard case.",
    status: "Available",
    type: "lost",
    imageUrl: "/images/prescription-glasses.jpg",
    reporter: "Liam D. (Architecture)",
    contactEmail: "liam.d@campus.edu",
    isUserReported: true,
  },
  {
    id: "item-9",
    title: "Toyota Smart Key Fob",
    category: "Keys",
    campus: "South Campus",
    location: "Parking Lot B",
    date: "Nov 19, 2026",
    description: "Black 3-button Toyota remote key fob with mini red paracord lanyard. Found near east parking gate.",
    status: "Available",
    type: "found",
    imageUrl: "/images/bike-key.jpg",
    reporter: "Parking Services Officer",
    contactEmail: "parking@campus.edu",
  },
  {
    id: "item-10",
    title: "MacBook Air 13-inch M2",
    category: "Electronics",
    campus: "Central Campus",
    location: "Computer Lab 3B",
    date: "Nov 15, 2026",
    description: "Space Gray MacBook Air with sticker of GitHub Octocat and university robotics club.",
    status: "Recovered",
    type: "lost",
    imageUrl: "/images/macbook-air.jpg",
    reporter: "David R. (Engineering)",
    contactEmail: "david.r@campus.edu",
  },
];

interface ItemsContextType {
  items: Item[];
  addItem: (item: {
    title: string;
    category: string;
    campus: string;
    location: string;
    description: string;
    type: "lost" | "found";
    imageUrl?: string;
    contactEmail?: string;
    reporter?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  claimItem: (itemId: string, proof: string, email: string) => Promise<{ success: boolean; error?: string }>;
  verifyClaim: (itemId: string, action: "approve" | "reject") => Promise<{ success: boolean; error?: string }>;
  markRecovered: (itemId: string) => Promise<{ success: boolean; error?: string }>;
  refreshItems: () => Promise<void>;
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
  claimingItem: Item | null;
  setClaimingItem: (item: Item | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportModalType: "lost" | "found";
  setReportModalType: (type: "lost" | "found") => void;
  openReportModal: (type?: "lost" | "found") => void;
  toast: ToastState | null;
  toastMessage?: string | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  isLoading: boolean;
  apiConnected: boolean;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

const STORAGE_KEY = "findit_campus_items_data_v4";

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<"lost" | "found">("lost");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const refreshItems = useCallback(async () => {
    try {
      const res = await fetch("/api/items", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
          setApiConnected(true);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.items));
          } catch { }
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable, using cached data", err);
      setApiConnected(false);
    }
  }, []);

  // Initial load effect
  useEffect(() => {
    let ignore = false;

    async function fetchInitialItems() {
      try {
        const res = await fetch("/api/items", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data.success && Array.isArray(data.items)) {
            setItems(data.items);
            setApiConnected(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.items));
            } catch {}
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Backend API not reachable, using cached data", err);
        if (!ignore) setApiConnected(false);
      }

      // Fallback to localStorage if API unreachable
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!ignore && Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load items from storage", e);
      }
      if (!ignore) setIsLoading(false);
    }

    fetchInitialItems();

    return () => {
      ignore = true;
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save items to storage", e);
      }
    }
  }, [items, isLoading]);

  const openReportModal = (type: "lost" | "found" = "lost") => {
    setReportModalType(type);
    setIsReportModalOpen(true);
  };

  const addItem = async (newItemData: {
    title: string;
    category: string;
    campus: string;
    location: string;
    description: string;
    type: "lost" | "found";
    imageUrl?: string;
    contactEmail?: string;
    reporter?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const fallbackImages: Record<string, string> = {
      Electronics: "/images/wireless-headphones.jpg",
      "ID Cards": "/images/student-id-card.jpg",
      Wallets: "/images/leather-wallet.jpg",
      Bottles: "/images/water-bottle.jpg",
      Keys: "/images/bike-key.jpg",
      Bags: "/images/college-backpack.jpg",
    };

    const userEmail = newItemData.contactEmail?.trim() || "student@university.edu";
    const userReporter =
      newItemData.reporter ||
      (newItemData.contactEmail?.trim()
        ? `Community Member (${newItemData.contactEmail.trim().split("@")[0]})`
        : "You (Submitted Just Now)");

    const payload = {
      title: newItemData.title.trim(),
      category: newItemData.category,
      campus: newItemData.campus,
      location: newItemData.location.trim(),
      date: today,
      description: newItemData.description.trim(),
      type: newItemData.type,
      imageUrl:
        newItemData.imageUrl ||
        fallbackImages[newItemData.category] ||
        "/images/bike-key.jpg",
      reporter: userReporter,
      contactEmail: userEmail,
      isUserReported: true,
    };

    // Client-side quick check
    if (!payload.title || payload.title.length < 3) {
      showToast("Title must be at least 3 characters long", "error");
      return { success: false, error: "Title must be at least 3 characters long" };
    }
    if (!payload.location || payload.location.length < 2) {
      showToast("Campus location is required", "error");
      return { success: false, error: "Campus location is required" };
    }
    if (!payload.description || payload.description.length < 5) {
      showToast("Description must be at least 5 characters long", "error");
      return { success: false, error: "Description must be at least 5 characters long" };
    }

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Failed to publish item report";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      if (data.success && data.item) {
        setItems((prev) => [data.item, ...prev]);
        setApiConnected(true);
        showToast(`Your ${newItemData.type} item report has been published!`, "success");
        return { success: true };
      }
    } catch (err) {
      console.warn("API request failed, fallback saving locally", err);
      setApiConnected(false);
    }

    // Fallback local update
    const localItem: Item = {
      id: `item-${Date.now()}`,
      ...payload,
      status: "Available",
    };
    setItems((prev) => [localItem, ...prev]);
    showToast(`Your ${newItemData.type} item report has been saved locally!`, "success");
    return { success: true };
  };

  const claimItem = async (
    itemId: string,
    proof: string,
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!proof || proof.trim().length < 5) {
      showToast("Please provide detailed identifying proof (at least 5 characters)", "error");
      return { success: false, error: "Identifying proof must be at least 5 characters" };
    }
    if (!email || !emailRegex.test(email.trim())) {
      showToast("Please provide a valid university email address", "error");
      return { success: false, error: "Valid email address is required" };
    }

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, proof: proof.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Failed to submit verification claim";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      if (data.success && data.item) {
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? data.item : item))
        );
        setApiConnected(true);
        showToast("Claim submitted! Routed to Staff Officer (nikhilminz04@gmail.com)", "success");
        return { success: true };
      }
    } catch (err) {
      console.warn("API claims error, updating locally", err);
      setApiConnected(false);
    }

    // Fallback local update
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
            ...item,
            status: "Claim Pending",
            claimantProof: proof,
            claimantEmail: email,
            staffReviewerEmail: "nikhilminz04@gmail.com",
          }
          : item
      )
    );
    showToast("Claim submitted! Routed to Staff Officer (nikhilminz04@gmail.com)", "success");
    return { success: true };
  };

  const verifyClaim = async (
    itemId: string,
    action: "approve" | "reject"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to process claim verification", "error");
        return { success: false, error: data.error };
      }
      if (data.success && data.item) {
        setItems((prev) => prev.map((item) => (item.id === itemId ? data.item : item)));
        setApiConnected(true);
        showToast(
          action === "approve"
            ? "Claim approved by Staff! Item marked as Recovered."
            : "Claim rejected by Staff. Item returned to Available pool.",
          "success"
        );
        return { success: true };
      }
    } catch (err) {
      console.warn("API claims PATCH error, updating locally", err);
      setApiConnected(false);
    }

    // Fallback local update
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
            ...item,
            status: action === "approve" ? "Recovered" : "Available",
            staffReviewerEmail: "nikhilminz04@gmail.com",
            ...(action === "reject" ? { claimantProof: undefined, claimantEmail: undefined } : {}),
          }
          : item
      )
    );
    showToast(
      action === "approve"
        ? "Claim approved by Staff! Item marked as Recovered."
        : "Claim rejected by Staff. Item returned to Available pool.",
      "success"
    );
    return { success: true };
  };

  const markRecovered = async (itemId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Recovered" }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to update item status", "error");
        return { success: false, error: data.error };
      }

      if (data.success && data.item) {
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? data.item : item))
        );
        setApiConnected(true);
        showToast("Status updated to Recovered!", "success");
        return { success: true };
      }
    } catch (err) {
      console.warn("API PATCH error, updating locally", err);
      setApiConnected(false);
    }

    // Fallback local update
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
            ...item,
            status: "Recovered",
          }
          : item
      )
    );
    showToast("Status updated to Recovered!", "success");
    return { success: true };
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        addItem,
        claimItem,
        verifyClaim,
        markRecovered,
        refreshItems,
        selectedItem,
        setSelectedItem,
        claimingItem,
        setClaimingItem,
        isReportModalOpen,
        setIsReportModalOpen,
        reportModalType,
        setReportModalType,
        openReportModal,
        toast,
        toastMessage: toast?.message,
        showToast,
        isLoading,
        apiConnected,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
}
