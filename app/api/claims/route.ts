import { NextRequest, NextResponse } from "next/server";
import { getAllItems, updateItem, getItemById } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STAFF_EMAIL = "nikhilminz04@gmail.com";

// GET /api/claims - return items with active or pending claims
export async function GET() {
  try {
    const items = getAllItems();
    const claims = items.filter(
      (item) => item.status === "Claim Pending" || Boolean(item.claimantEmail)
    );

    return NextResponse.json({
      success: true,
      staffReviewerEmail: STAFF_EMAIL,
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
      staffReviewerEmail: STAFF_EMAIL,
    });

    return NextResponse.json({
      success: true,
      message: `Ownership verification claim successfully submitted to Campus Staff Officer (${STAFF_EMAIL})`,
      staffReviewerEmail: STAFF_EMAIL,
      claim: {
        itemId,
        itemTitle: item.title,
        status: "Claim Pending",
        claimantEmail: email.trim(),
        claimantProof: proof.trim(),
        staffReviewerEmail: STAFF_EMAIL,
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

// PATCH /api/claims - staff verification endpoint to approve or reject a claim
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, action } = body; // action: "approve" | "reject"

    if (!itemId) {
      return NextResponse.json({ success: false, error: "Item ID is required" }, { status: 400 });
    }

    const item = getItemById(itemId);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "Recovered" : "Available";
    const updated = updateItem(itemId, {
      status: newStatus,
      staffReviewerEmail: STAFF_EMAIL,
      ...(action === "reject" ? { claimantProof: undefined, claimantEmail: undefined } : {}),
    });

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? `Claim approved by Staff Officer (${STAFF_EMAIL}) and marked as Recovered`
          : `Claim rejected by Staff Officer (${STAFF_EMAIL}) and returned to Available pool`,
      item: updated,
    });
  } catch (error) {
    console.error("PATCH /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process claim verification action" },
      { status: 500 }
    );
  }
}
