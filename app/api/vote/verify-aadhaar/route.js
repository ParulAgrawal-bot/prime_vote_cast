import { NextResponse } from "next/server";
import { registerIfMissing, isMinimumAge } from "@/lib/eligibleVoters";

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

    // Check if voter is 18 years or older
    if (!isMinimumAge(dob, 18)) {
      return NextResponse.json(
        { error: "You must be 18 years or older to vote." },
        { status: 403 }
      );
    }

    const { created, dobMismatch } = registerIfMissing(aadhaarStr, dob);
    if (dobMismatch) {
      return NextResponse.json(
        { error: "Date of birth does not match this Aadhaar." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: created
          ? "New voter registered and verified."
          : "Voter verified. You can proceed to vote.",
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
