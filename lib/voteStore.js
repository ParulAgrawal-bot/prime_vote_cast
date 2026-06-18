import fs from "fs";
import path from "path";
import { encryptVote } from "@/utils/encrypt.js";

const VOTES_FILE = path.join(process.cwd(), "data", "votes.json");

/** @type {Map<string, Array<{ hasVoted: boolean, selection: string, electionTitle: string, votedAt: string }>>} */
const store = new Map();

function loadFromDisk() {
  try {
    const raw = fs.readFileSync(VOTES_FILE, "utf8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    for (const row of arr) {
      if (row?.aadhaar) {
        const key = String(row.aadhaar).trim();
        if (!store.has(key)) {
          store.set(key, []);
        }
        if (row?.hasVoted) {
          store.get(key).push({
            hasVoted: true,
            selection: String(row.selection ?? ""),
            electionTitle: String(row.electionTitle ?? row.election ?? ""),
            votedAt: String(row.votedAt ?? new Date().toISOString()),
          });
        }
      }
    }
  } catch {
    // file missing or invalid — start empty
  }
}

function persistToDisk() {
  const arr = [];
  store.forEach((votes, aadhaar) => {
    votes.forEach((vote) => {
      arr.push({
        aadhaar,
        hasVoted: vote.hasVoted,
        selection: vote.selection,
        electionTitle: vote.electionTitle,
        votedAt: vote.votedAt,
      });
    });
  });
  fs.mkdirSync(path.dirname(VOTES_FILE), { recursive: true });
  fs.writeFileSync(VOTES_FILE, JSON.stringify(arr, null, 2), "utf8");
}

loadFromDisk();

export function hasVoted(aadhaar) {
  const votes = store.get(String(aadhaar).trim());
  return votes && votes.length > 0;
}

export function hasVotedForElection(aadhaar, electionTitle) {
  const key = String(aadhaar).trim();
  const votes = store.get(key);
  if (!votes) return false;
  return votes.some(
    (v) =>
      v.hasVoted &&
      String(v.electionTitle).trim() === String(electionTitle).trim()
  );
}

export function getVote(aadhaar) {
  return store.get(String(aadhaar).trim()) ?? null;
}

export function recordVote(aadhaar, selection, electionTitle = "") {
  const key = String(aadhaar).trim();
  const votedAt = new Date().toISOString();

  // Encrypt the selection before storing
  const encryptedSelection = encryptVote(selection);

  if (!store.has(key)) {
    store.set(key, []);
  }

  store.get(key).push({
    hasVoted: true,
    selection: encryptedSelection,
    electionTitle: String(electionTitle).trim(),
    votedAt,
  });

  persistToDisk();
}
