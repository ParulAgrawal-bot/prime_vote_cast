import { NextResponse } from "next/server";
import { registerIfMissing } from "@/lib/eligibleVoters";
import { hasVoted } from "@/lib/voteStore";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { aadhaar, dob } = await req.json();
    const aadhaarStr = aadhaar != null ? String(aadhaar).trim() : "";

    if (!aadhaarStr || !dob) {
      return NextResponse.json(
        { error: "Aadhaar and date of birth are required." },
        { status: 400 }
      );
    }

    const { created, dobMismatch } = registerIfMissing(aadhaarStr, dob);
    if (dobMismatch) {
      return NextResponse.json(
        { error: "Date of birth does not match this Aadhaar." },
        { status: 403 }
      );
    }

    if (hasVoted(aadhaarStr)) {
      return NextResponse.json(
        { error: "You have already voted.", hasVoted: true },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: created
          ? "New voter registered and verified."
          : "Voter verified.",
        hasVoted: false,
        registeredNow: created,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Verification failed: " + error.message },
      { status: 500 }
    );
  }
}
