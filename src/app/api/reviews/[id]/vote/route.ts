import { NextRequest, NextResponse } from "next/server";
import { calculateWilsonScore } from "@/lib/reviews/reviewModel";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { vote } = await request.json(); // "up" or "down"
    const reviewId = params.id;

    // Fetch review from main reviews endpoint
    const url = new URL("/api/reviews", request.url);
    const reviewsRes = await fetch(url.toString());
    const reviews = await reviewsRes.json();
    const review = reviews.find((r: any) => r.id === reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (vote === "up") {
      review.upvotes = (review.upvotes || 0) + 1;
    } else if (vote === "down") {
      review.downvotes = (review.downvotes || 0) + 1;
    }

    review.wilsonScore = calculateWilsonScore(review.upvotes, review.downvotes);

    return NextResponse.json({
      success: true,
      upvotes: review.upvotes,
      downvotes: review.downvotes,
      wilsonScore: review.wilsonScore,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
