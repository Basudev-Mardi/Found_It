"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  isUserReported?: boolean;
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
    status: "Available",
    type: "found",
    imageUrl: "/images/student-id-card.jpg",
    reporter: "Campus Security Desk",
    contactEmail: "security@campus.edu",
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
  }) => void;
  claimItem: (itemId: string, proof: string, email: string) => void;
  markRecovered: (itemId: string) => void;
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
  claimingItem: Item | null;
  setClaimingItem: (item: Item | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportModalType: "lost" | "found";
  setReportModalType: (type: "lost" | "found") => void;
  openReportModal: (type?: "lost" | "found") => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

const STORAGE_KEY = "findit_campus_items_data_v4";

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<"lost" | "found">("lost");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Backend API with localStorage fallback
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items) && data.items.length > 0) {
            setItems(data.items);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.items));
            setIsLoaded(true);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch from /api/items, falling back to localStorage", err);
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load items from storage", e);
      }
      setIsLoaded(true);
    }

    loadData();
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save items to storage", e);
      }
    }
  }, [items, isLoaded]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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
  }) => {
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

    const payload = {
      title: newItemData.title,
      category: newItemData.category,
      campus: newItemData.campus,
      location: newItemData.location,
      date: today,
      description: newItemData.description,
      type: newItemData.type,
      imageUrl:
        newItemData.imageUrl ||
        fallbackImages[newItemData.category] ||
        "/images/bike-key.jpg",
      reporter: "You (Submitted Just Now)",
      contactEmail: "student@university.edu",
      isUserReported: true,
    };

    // Try posting to backend API
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) => [data.item, ...prev]);
          showToast(`Your ${newItemData.type} item report has been published!`);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API POST /api/items unavailable, updating locally", err);
    }

    // Fallback local update
    const localItem: Item = {
      id: `item-${Date.now()}`,
      ...payload,
      status: "Available",
    };
    setItems((prev) => [localItem, ...prev]);
    showToast(`Your ${newItemData.type} item report has been published!`);
  };

  const claimItem = async (itemId: string, proof: string, email: string) => {
    // Try posting to backend claims API
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, proof, email }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) =>
            prev.map((item) => (item.id === itemId ? data.item : item))
          );
          showToast("Claim verification submitted to Campus Security!");
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API POST /api/claims unavailable, updating locally", err);
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
            }
          : item
      )
    );
    showToast("Claim verification submitted to Campus Security!");
  };

  const markRecovered = async (itemId: string) => {
    // Try updating via backend API
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Recovered" }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) =>
            prev.map((item) => (item.id === itemId ? data.item : item))
          );
          showToast("Status updated to Recovered!");
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API PATCH /api/items/[id] unavailable, updating locally", err);
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
    showToast("Status updated to Recovered!");
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        addItem,
        claimItem,
        markRecovered,
        selectedItem,
        setSelectedItem,
        claimingItem,
        setClaimingItem,
        isReportModalOpen,
        setIsReportModalOpen,
        reportModalType,
        setReportModalType,
        openReportModal,
        toastMessage,
        showToast,
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
