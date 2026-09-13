import { NextResponse } from "next/server";
import { telemetry } from "@/lib/api/telemetry";

export async function GET() {
  const stats = telemetry.getStats();
  return NextResponse.json(stats);
}

export async function DELETE() {
  telemetry.clear();
  return NextResponse.json({ cleared: true });
}
