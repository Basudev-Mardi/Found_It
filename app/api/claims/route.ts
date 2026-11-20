import { NextRequest, NextResponse } from "next/server";
import { getAllItems, updateItem, getItemById } from "@/lib/db";

// GET /api/claims - return items with active or pending claims
export async function GET() {
  try {
    const items = getAllItems();
    const claims = items.filter(
      (item) => item.status === "Claim Pending" || Boolean(item.claimantEmail)
    );

    return NextResponse.json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error("GET /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

// POST /api/claims - submit ownership claim for found item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, proof, email } = body;

    if (!itemId || !proof || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: itemId, proof, email" },
        { status: 400 }
      );
    }

    const item = getItemById(itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: `Item with id '${itemId}' not found` },
        { status: 404 }
      );
    }

    const updated = updateItem(itemId, {
      status: "Claim Pending",
      claimantProof: proof,
      claimantEmail: email,
    });

    return NextResponse.json({
      success: true,
      message: "Ownership verification claim submitted to Campus Security Desk",
      claim: {
        itemId,
        itemTitle: item.title,
        status: "Claim Pending",
        claimantEmail: email,
        claimantProof: proof,
        submittedAt: new Date().toISOString(),
      },
      item: updated,
    });
  } catch (error) {
    console.error("POST /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit claim" },
      { status: 500 }
    );
  }
}
