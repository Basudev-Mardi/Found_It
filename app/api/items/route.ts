import { NextRequest, NextResponse } from "next/server";
import { getAllItems, createItem } from "@/lib/db";

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

// POST /api/items - create a new lost or found item report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.location || !body.description || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, location, description, type",
        },
        { status: 400 }
      );
    }

    if (body.type !== "lost" && body.type !== "found") {
      return NextResponse.json(
        { success: false, error: "Type must be either 'lost' or 'found'" },
        { status: 400 }
      );
    }

    const newItem = createItem({
      title: body.title,
      category: body.category || "Other",
      campus: body.campus || "Central Campus",
      location: body.location,
      description: body.description,
      type: body.type,
      imageUrl: body.imageUrl,
      reporter: body.reporter || "Campus Community Member",
      contactEmail: body.contactEmail || "student@university.edu",
      isUserReported: body.isUserReported ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${body.type === "lost" ? "Lost" : "Found"} report created successfully`,
        item: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}
