import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reason, user = "anonymous" } = await request.json();

    return NextResponse.json({
      success: true,
      reviewId: params.id,
      flagged: {
        reason: reason || "Inappropriate content",
        flaggedBy: user,
        timestamp: Date.now(),
      },
      message: "Thank you for reporting. This review has been submitted for moderation.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
