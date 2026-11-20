import fs from "fs";
import path from "path";
import os from "os";

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

// On Vercel / serverless environments, the root directory (/var/task) is read-only.
// We write to os.tmpdir() on Vercel while reading the initial seed from bundled data.
const isVercel = Boolean(process.env.VERCEL);
const BUNDLED_FILE = path.join(process.cwd(), "data", "items.json");
const TMP_FILE = path.join(os.tmpdir(), "findit_items.json");

const DATA_FILE = isVercel ? TMP_FILE : BUNDLED_FILE;

// Global in-memory cache to retain updates across warm lambda invocations
let memoryItems: Item[] | null = null;

function ensureDataFile(): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      if (fs.existsSync(BUNDLED_FILE)) {
        const seed = fs.readFileSync(BUNDLED_FILE, "utf-8");
        fs.writeFileSync(DATA_FILE, seed, "utf-8");
      } else {
        fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      }
    }
  } catch (err) {
    console.warn("Could not ensure data file on filesystem, falling back to in-memory store:", err);
  }
}

export function getAllItems(): Item[] {
  if (memoryItems && memoryItems.length > 0) {
    return memoryItems;
  }

  ensureDataFile();

  // Try DATA_FILE first
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Item[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryItems = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Error reading from primary DATA_FILE:", error);
  }

  // Fallback to reading BUNDLED_FILE
  try {
    if (fs.existsSync(BUNDLED_FILE)) {
      const raw = fs.readFileSync(BUNDLED_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Item[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryItems = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Error reading bundled items.json:", error);
  }

  return memoryItems || [];
}

export function saveAllItems(items: Item[]): void {
  memoryItems = [...items];
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.warn("Could not persist items to disk (safe fallback to in-memory):", error);
  }
}

export function getItemById(id: string): Item | undefined {
  const items = getAllItems();
  return items.find((item) => item.id === id);
}

export function createItem(data: Omit<Item, "id" | "date" | "status"> & { date?: string; status?: Item["status"] }): Item {
  const items = getAllItems();
  const today = data.date || new Date().toLocaleDateString("en-US", {
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

  const newItem: Item = {
    id: `item-${Date.now()}`,
    title: data.title,
    category: data.category,
    campus: data.campus,
    location: data.location,
    date: today,
    description: data.description,
    status: data.status || "Available",
    type: data.type,
    imageUrl: data.imageUrl || fallbackImages[data.category] || "/images/bike-key.jpg",
    reporter: data.reporter || "Campus Community Member",
    contactEmail: data.contactEmail || "student@university.edu",
    isUserReported: data.isUserReported ?? true,
  };

  items.unshift(newItem);
  saveAllItems(items);
  return newItem;
}

export function updateItem(id: string, updates: Partial<Item>): Item | null {
  const items = getAllItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...updates };
  saveAllItems(items);
  return items[index];
}

export function deleteItem(id: string): boolean {
  const items = getAllItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;

  saveAllItems(filtered);
  return true;
}
