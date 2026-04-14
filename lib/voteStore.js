import fs from "fs";
import path from "path";

const VOTES_FILE = path.join(process.cwd(), "data", "votes.json");

/** @type {Map<string, { hasVoted: boolean, selection: string, votedAt: string }>} */
const store = new Map();

function loadFromDisk() {
  try {
    const raw = fs.readFileSync(VOTES_FILE, "utf8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    for (const row of arr) {
      if (row?.aadhaar && row?.hasVoted) {
        const key = String(row.aadhaar).trim();
        store.set(key, {
          hasVoted: true,
          selection: String(row.selection ?? ""),
          votedAt: String(row.votedAt ?? new Date().toISOString()),
        });
      }
    }
  } catch {
    // file missing or invalid — start empty
  }
}

function persistToDisk() {
  const arr = [...store.entries()].map(([aadhaar, v]) => ({
    aadhaar,
    hasVoted: v.hasVoted,
    selection: v.selection,
    votedAt: v.votedAt,
  }));
  fs.mkdirSync(path.dirname(VOTES_FILE), { recursive: true });
  fs.writeFileSync(VOTES_FILE, JSON.stringify(arr, null, 2), "utf8");
}

loadFromDisk();

export function hasVoted(aadhaar) {
  return store.get(String(aadhaar).trim())?.hasVoted === true;
}

export function getVote(aadhaar) {
  return store.get(String(aadhaar).trim()) ?? null;
}

export function recordVote(aadhaar, selection) {
  const key = String(aadhaar).trim();
  const votedAt = new Date().toISOString();
  store.set(key, { hasVoted: true, selection, votedAt });
  persistToDisk();
}
