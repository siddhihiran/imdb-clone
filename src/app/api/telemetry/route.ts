import { NextResponse } from "next/server";
import { telemetry } from "@/lib/api/telemetry";

export async function GET() {
  const stats = telemetry.getStats();
  return NextResponse.json(stats);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.type === "web-vital" && body.metric) {
      telemetry.recordWebVital(body.metric);
      return NextResponse.json({ recorded: true });
    }
    if (body.type === "trace" && body.record) {
      telemetry.record(body.record);
      return NextResponse.json({ recorded: true });
    }
    return NextResponse.json({ error: "Invalid telemetry payload" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process telemetry" }, { status: 500 });
  }
}

export async function DELETE() {
  telemetry.clear();
  return NextResponse.json({ cleared: true });
}
