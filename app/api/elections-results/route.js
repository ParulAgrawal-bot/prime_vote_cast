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

function readElections() {
  const p = path.join(process.cwd(), "data", "elections.json");
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
    const votes = readVotes();
    const elections = readElections();

    // Group votes by election
    const electionResults = {};

    elections.forEach((election) => {
      electionResults[election.title] = {
        election: election.title,
        type: election.type,
        region: election.region,
        status: election.status,
        total: 0,
        options: {
          "Option A": 0,
          "Option B": 0,
          "Option C": 0,
        },
      };
    });

    // Initialize votes for active elections not yet in results
    votes.forEach((vote) => {
      if (vote.electionTitle && !electionResults[vote.electionTitle]) {
        electionResults[vote.electionTitle] = {
          election: vote.electionTitle,
          total: 0,
          options: {
            "Option A": 0,
            "Option B": 0,
            "Option C": 0,
          },
        };
      }
    });

    // Count votes by election
    votes.forEach((vote) => {
      try {
        if (vote.hasVoted && vote.selection) {
          const electionTitle = String(vote.electionTitle || "Uncategorized").trim();
          if (!electionResults[electionTitle]) {
            electionResults[electionTitle] = {
              election: electionTitle,
              total: 0,
              options: {
                "Option A": 0,
                "Option B": 0,
                "Option C": 0,
              },
            };
          }

          let selection = vote.selection;

          // Attempt to decrypt if it looks encrypted
          if (selection.includes(":")) {
            try {
              selection = decryptVote(selection);
            } catch (e) {
              console.warn("Failed to decrypt vote:", e.message);
            }
          }

          selection = String(selection).trim();
          if (electionResults[electionTitle].options.hasOwnProperty(selection)) {
            electionResults[electionTitle].options[selection]++;
            electionResults[electionTitle].total++;
          }
        }
      } catch (e) {
        console.error("Error processing vote:", e);
      }
    });

    // Calculate percentages
    const results = Object.values(electionResults).map((election) => ({
      election: election.election,
      type: election.type || "",
      region: election.region || "",
      status: election.status || "",
      total: election.total,
      options: Object.entries(election.options).map(([option, count]) => ({
        option,
        count,
        percentage: election.total > 0 ? Math.round((count / election.total) * 100) : 0,
      })),
    }));

    return NextResponse.json({
      elections: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Results API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch results" },
      { status: 500 }
    );
  }
}
