import { NextResponse } from "next/server";
import { isRegisteredAadhaar } from "@/lib/eligibleVoters";
import { hasVoted, recordVote } from "@/lib/voteStore";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const aadhaar = body.aadhaar != null ? String(body.aadhaar).trim() : "";
    const selection = body.selection != null ? String(body.selection).trim() : "";

    if (!aadhaar || !selection) {
      return NextResponse.json(
        { error: "Aadhaar and selection are required." },
        { status: 400 }
      );
    }

    if (!isRegisteredAadhaar(aadhaar)) {
      return NextResponse.json({ error: "Voter not found." }, { status: 404 });
    }

    if (hasVoted(aadhaar)) {
      return NextResponse.json(
        { error: "You have already cast a vote." },
        { status: 409 }
      );
    }

    recordVote(aadhaar, selection);

    return NextResponse.json({
      success: true,
      message: "Vote recorded",
    });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
