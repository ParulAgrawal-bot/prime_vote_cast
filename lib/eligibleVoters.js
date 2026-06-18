import fs from "fs";
import path from "path";

let cached = null;
const ELIGIBLE_FILE = path.join(process.cwd(), "data", "eligible-voters.json");

function dobMatches(stored, input) {
  const inp = String(input ?? "").trim().slice(0, 10);
  if (!inp) return false;
  if (stored instanceof Date) {
    return stored.toISOString().slice(0, 10) === inp;
  }
  const s = String(stored ?? "").trim().slice(0, 10);
  return s === inp;
}

/**
 * Registered voters (identity whitelist). Edit data/eligible-voters.json.
 */
export function getEligibleVoters() {
  if (cached) return cached;
  try {
    const raw = fs.readFileSync(ELIGIBLE_FILE, "utf8");
    const data = JSON.parse(raw);
    cached = Array.isArray(data) ? data : [];
  } catch {
    cached = [];
  }
  return cached;
}

function persistEligibleVoters() {
  fs.mkdirSync(path.dirname(ELIGIBLE_FILE), { recursive: true });
  fs.writeFileSync(ELIGIBLE_FILE, JSON.stringify(getEligibleVoters(), null, 2), "utf8");
}

export function findEligibleByAadhaar(aadhaar) {
  const a = String(aadhaar ?? "").trim();
  return getEligibleVoters().find((row) => row.aadhaar === a) ?? null;
}

export function findEligibleByAadhaarAndDob(aadhaar, dob) {
  const a = String(aadhaar ?? "").trim();
  return getEligibleVoters().find(
    (row) => row.aadhaar === a && dobMatches(row.dob, dob)
  );
}

export function isRegisteredAadhaar(aadhaar) {
  const a = String(aadhaar ?? "").trim();
  return getEligibleVoters().some((row) => row.aadhaar === a);
}

/**
 * Check if a person is 18 years or older based on their date of birth
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {boolean} - True if 18+, false otherwise
 */
export function isMinimumAge(dob, minAge = 18) {
  const d = String(dob ?? "").trim().slice(0, 10);
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return false;
  }

  const birthDate = new Date(d);
  if (isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= minAge;
}

/**
 * Register voter only when Aadhaar is new.
 * Returns { created, voter, dobMismatch }.
 */
export function registerIfMissing(aadhaar, dob) {
  const a = String(aadhaar ?? "").trim();
  const d = String(dob ?? "").trim().slice(0, 10);
  if (!a || !d) {
    return { created: false, voter: null, dobMismatch: false };
  }

  const existing = findEligibleByAadhaar(a);
  if (!existing) {
    const voter = { aadhaar: a, dob: d };
    getEligibleVoters().push(voter);
    persistEligibleVoters();
    return { created: true, voter, dobMismatch: false };
  }

  if (!dobMatches(existing.dob, d)) {
    return { created: false, voter: existing, dobMismatch: true };
  }

  return { created: false, voter: existing, dobMismatch: false };
}
