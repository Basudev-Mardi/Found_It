import { NextResponse } from "next/server";
import { getAllItems } from "@/lib/db";

// GET /api/stats - campus lost and found statistics
export async function GET() {
  try {
    const items = getAllItems();

    const total = items.length;
    const lost = items.filter((i) => i.type === "lost").length;
    const found = items.filter((i) => i.type === "found").length;
    const recovered = items.filter((i) => i.status === "Recovered").length;
    const pendingClaims = items.filter((i) => i.status === "Claim Pending").length;
    const available = items.filter((i) => i.status === "Available").length;

    const recoveryRate = total > 0 ? ((recovered / total) * 100).toFixed(1) + "%" : "0%";

    return NextResponse.json({
      success: true,
      stats: {
        totalItems: total,
        lostItems: lost,
        foundItems: found,
        recoveredItems: recovered,
        pendingClaims,
        availableItems: available,
        recoveryRate,
      },
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
