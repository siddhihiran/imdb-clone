import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const tag = body.tag || request.nextUrl.searchParams.get("tag");

    if (!tag) {
      return NextResponse.json({ error: "Missing tag parameter" }, { status: 400 });
    }

    revalidateTag(tag);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to revalidate" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  if (!tag) {
    return NextResponse.json({ error: "Missing tag parameter" }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({
    revalidated: true,
    tag,
    now: Date.now(),
  });
}
