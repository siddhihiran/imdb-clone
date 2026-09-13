import { NextRequest, NextResponse } from "next/server";
import { movieApi } from "@/lib/api/client";
import { requestCoalescer } from "@/lib/api/requestCoalescer";
import crypto from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id;

    // Use request coalescing to prevent duplicate concurrent DB / API calls
    const movie = await requestCoalescer.coalesce(`movie-${movieId}`, () =>
      movieApi.getMovieById(movieId)
    );

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Generate ETag from movie content
    const contentString = JSON.stringify(movie);
    const etag = `"${crypto.createHash("sha1").update(contentString).digest("hex")}"`;

    // Check If-None-Match header
    const clientEtag = request.headers.get("if-none-match");
    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        },
      });
    }

    return NextResponse.json(movie, {
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch movie" },
      { status: 500 }
    );
  }
}
