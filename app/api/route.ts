import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true, message: "MongoDB connection is healthy." });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Database connection failed" },
      { status: 500 },
    );
  }
}
