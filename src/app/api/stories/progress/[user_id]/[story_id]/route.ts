import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string; story_id: string }> }
) {
  // Await params in Next.js 15+
  const { user_id, story_id } = await params;
  const { searchParams } = new URL(request.url);
  const story_type = searchParams.get("story_type");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!story_type) {
    return NextResponse.json(
      { status: "error", message: "story_type is required" },
      { status: 400 }
    );
  }

  try {
    // Make request to your backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${backendUrl}/stories/progress/${user_id}/${story_id}?story_type=${story_type}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", // Important for polling
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          status: "error",
          message: errorData.message || `Backend error: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching story progress:", error);

    // Narrow the error type safely
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    return NextResponse.json(
      {
        status: "error",
        message: `Failed to fetch story progress: ${message}`,
      },
      { status: 500 }
    );
  }
}