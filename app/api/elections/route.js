import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function readElections() {
  const p = path.join(process.cwd(), "data", "elections.json");
  const raw = fs.readFileSync(p, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const region = (url.searchParams.get("region") || "All Regions").trim();
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    const filter = (url.searchParams.get("filter") || "All").trim();

    const elections = readElections();

    const regions = [
      "All Regions",
      ...Array.from(new Set(elections.map((e) => e.region).filter(Boolean))).sort(),
    ];

    const filtered = elections.filter((e) => {
      const matchesRegion = region === "All Regions" || e.region === region;
      const matchesText = !q || String(e.title || "").toLowerCase().includes(q);

      const matchesFilter =
        filter === "All" ||
        String(e.status || "").toLowerCase() === filter.toLowerCase() ||
        String(e.type || "") === filter;

      return matchesRegion && matchesText && matchesFilter;
    });

    return NextResponse.json({ elections: filtered, regions });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to load elections" },
      { status: 500 }
    );
  }
}

