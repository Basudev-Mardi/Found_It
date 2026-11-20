import { NextRequest, NextResponse } from "next/server";
import { getAllItems, updateItem, getItemById } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// POST /api/claims - submit ownership claim for found item with validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, proof, email } = body;

    const errors: string[] = [];

    if (!itemId || typeof itemId !== "string") {
      errors.push("Item ID is required to process claim.");
    }

    if (!proof || typeof proof !== "string" || proof.trim().length < 5) {
      errors.push("Secret identifying details must be at least 5 characters long.");
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      errors.push("A valid university or student email address is required.");
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

    const item = getItemById(itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: `Found item with ID '${itemId}' was not found in the campus registry.` },
        { status: 404 }
      );
    }

    const updated = updateItem(itemId, {
      status: "Claim Pending",
      claimantProof: proof.trim(),
      claimantEmail: email.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Ownership verification claim successfully submitted to Campus Security Desk",
      claim: {
        itemId,
        itemTitle: item.title,
        status: "Claim Pending",
        claimantEmail: email.trim(),
        claimantProof: proof.trim(),
        submittedAt: new Date().toISOString(),
      },
      item: updated,
    });
  } catch (error) {
    console.error("POST /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit claim verification request" },
      { status: 500 }
    );
  }
}
