import { NextResponse } from "next/server";
import { isRegisteredAadhaar } from "@/lib/eligibleVoters";
import { hasVotedForElection, recordVote } from "@/lib/voteStore";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const aadhaar = body.aadhaar != null ? String(body.aadhaar).trim() : "";
    const selection = body.selection != null ? String(body.selection).trim() : "";
    const electionTitle = body.electionTitle != null ? String(body.electionTitle).trim() : "";

    if (!aadhaar || !selection || !electionTitle) {
      return NextResponse.json(
        { error: "Aadhaar, selection, and election are required." },
        { status: 400 }
      );
    }

    if (!isRegisteredAadhaar(aadhaar)) {
      return NextResponse.json({ error: "Voter not found." }, { status: 404 });
    }

    if (hasVotedForElection(aadhaar, electionTitle)) {
      return NextResponse.json(
        { error: "You have already cast a vote in this election." },
        { status: 409 }
      );
    }

    recordVote(aadhaar, selection, electionTitle);

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
