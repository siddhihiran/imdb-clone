import { NextRequest, NextResponse } from "next/server";
import { MovieItem } from "@/lib/data/mockData";

// In-memory mock backend database
let serverWatchlist: MovieItem[] = [];

export async function GET() {
  return NextResponse.json({
    items: serverWatchlist,
    count: serverWatchlist.length,
    timestamp: Date.now(),
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const simulateFail = searchParams.get("fail") === "true";

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (simulateFail) {
    return NextResponse.json(
      { error: "Simulated network failure on mock backend" },
      { status: 500 }
    );
  }

  try {
    const { movie } = await request.json();
    if (!movie || !movie.id) {
      return NextResponse.json({ error: "Invalid movie payload" }, { status: 400 });
    }

    if (!serverWatchlist.some((m) => m.id.toString() === movie.id.toString())) {
      serverWatchlist.unshift(movie);
    }

    return NextResponse.json({
      success: true,
      items: serverWatchlist,
      count: serverWatchlist.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const simulateFail = searchParams.get("fail") === "true";

  await new Promise((resolve) => setTimeout(resolve, 300));

  if (simulateFail) {
    return NextResponse.json(
      { error: "Simulated network failure on deletion" },
      { status: 500 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: "Missing movie id" }, { status: 400 });
  }

  serverWatchlist = serverWatchlist.filter((m) => m.id.toString() !== id.toString());

  return NextResponse.json({
    success: true,
    items: serverWatchlist,
    count: serverWatchlist.length,
  });
}
