import { NextRequest, NextResponse } from "next/server";
import { movieApi } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
  const cursor = searchParams.get("cursor");
  const sort = (searchParams.get("sort") as any) || undefined;
  const genre = searchParams.get("genre") || undefined;
  const search = searchParams.get("search") || undefined;

  try {
    const result = await movieApi.getMovies({
      page,
      limit,
      cursor,
      sort,
      genre,
      search,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
