import { NextResponse } from "next/server";

import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb("admin");
    await db.command({ ping: 1 });
    return NextResponse.json({ ok: true, message: "MongoDB connection is healthy." });
  } catch (error) {
    console.error("MongoDB ping failed", error);
    return NextResponse.json(
      { ok: false, error: "Database connection failed" },
      { status: 500 },
    );
  }
}
