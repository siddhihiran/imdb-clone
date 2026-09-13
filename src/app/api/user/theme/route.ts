import { NextRequest, NextResponse } from "next/server";

// Mock user DB store for theme preferences
const userThemes = new Map<string, string>();

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "current-user-id";
  const theme = userThemes.get(userId) || "dark";
  return NextResponse.json({ userId, theme });
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const userId = request.headers.get("x-user-id") || "current-user-id";
    const theme = json.theme || "dark";

    userThemes.set(userId, theme);
    return NextResponse.json({ success: true, userId, theme });
  } catch {
    return NextResponse.json({ error: "Invalid theme payload" }, { status: 400 });
  }
}
