import { NextRequest, NextResponse } from "next/server";
import { getAllItems, createItem } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/items - list items with optional search & filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "lost" | "found"
    const category = searchParams.get("category");
    const campus = searchParams.get("campus");
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.toLowerCase();

    let items = getAllItems();

    if (type && (type === "lost" || type === "found")) {
      items = items.filter((item) => item.type === type);
    }

    if (category && category !== "All" && category !== "All Categories") {
      items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    if (campus && campus !== "All" && campus !== "All Campuses") {
      items = items.filter((item) => item.campus.toLowerCase() === campus.toLowerCase());
    }

    if (status && status !== "All" && status !== "All Status") {
      items = items.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    }

    if (q) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST /api/items - create a new lost or found item report with strict validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, description, type, category, campus, imageUrl, reporter, contactEmail } = body;

    const errors: string[] = [];

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      errors.push("Title is required and must be at least 3 characters long.");
    }

    if (!location || typeof location !== "string" || location.trim().length < 2) {
      errors.push("Specific campus location is required (e.g. Central Library 2nd Floor).");
    }

    if (!description || typeof description !== "string" || description.trim().length < 5) {
      errors.push("Description is required and must be at least 5 characters long.");
    }

    if (!type || (type !== "lost" && type !== "found")) {
      errors.push("Type must be either 'lost' or 'found'.");
    }

    if (contactEmail && typeof contactEmail === "string" && !EMAIL_REGEX.test(contactEmail.trim())) {
      errors.push("Please provide a valid contact email address.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: errors[0],
          errors,
        },
        { status: 400 }
      );
    }

    const newItem = createItem({
      title: title.trim(),
      category: category || "Other",
      campus: campus || "Central Campus",
      location: location.trim(),
      description: description.trim(),
      type,
      imageUrl,
      reporter: reporter || (contactEmail?.trim() ? `Member (${contactEmail.trim().split("@")[0]})` : "Campus Community Member"),
      contactEmail: contactEmail ? contactEmail.trim() : "student@university.edu",
      isUserReported: body.isUserReported ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${type === "lost" ? "Lost" : "Found"} report created successfully`,
        item: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process item report", details: error instanceof Error ? error.message : "Invalid JSON" },
      { status: 500 }
    );
  }
}
