import fs from "fs";
import path from "path";

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

const DATA_FILE = path.join(process.cwd(), "data", "items.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

export function getAllItems(): Item[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Item[];
  } catch (error) {
    console.error("Error reading items from file:", error);
    return [];
  }
}

export function saveAllItems(items: Item[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
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
    imageUrl: data.imageUrl || "/images/bike-key.jpg",
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
