import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { decryptVote } from "@/utils/encrypt.js";

export const runtime = "nodejs";

function readVotes() {
  const p = path.join(process.cwd(), "data", "votes.json");
  try {
    const raw = fs.readFileSync(p, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const electionTitle = (url.searchParams.get("election") || "").trim();
    
    const votes = readVotes();
    
    // Count votes by option
    const voteCount = {
      "Option A": 0,
      "Option B": 0,
      "Option C": 0,
    };
    
    let totalVotes = 0;
    
    // Decrypt and count each vote
    votes.forEach((vote) => {
      try {
        if (vote.hasVoted && vote.selection) {
          // Filter by election if specified
          if (electionTitle && String(vote.electionTitle || "").trim() !== electionTitle) {
            return;
          }
          
          let selection = vote.selection;
          
          // Attempt to decrypt if it looks encrypted (contains colon)
          if (selection.includes(":")) {
            try {
              selection = decryptVote(selection);
            } catch (e) {
              // If decryption fails, use the raw value (might be old unencrypted data)
              console.warn("Failed to decrypt vote, using raw value:", e.message);
            }
          }
          
          // Normalize selection and count
          selection = String(selection).trim();
          if (voteCount.hasOwnProperty(selection)) {
            voteCount[selection]++;
            totalVotes++;
          }
        }
      } catch (e) {
        console.error("Error processing vote:", e);
      }
    });
    
    // Calculate percentages
    const results = {
      total: totalVotes,
      election: electionTitle || "All Elections",
      options: Object.entries(voteCount).map(([option, count]) => ({
        option,
        count,
        percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
      })),
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Results API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch results" },
      { status: 500 }
    );
  }
}
