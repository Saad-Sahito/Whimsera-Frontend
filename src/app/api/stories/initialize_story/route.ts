import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    console.log("initialize_story - Received request body:", JSON.stringify(body, null, 2));

    // Validate inputs
    if (!body.user_id || !body.story_type) {
      const errorResponse = { status: "error", message: "Missing required fields" };
      console.log("initialize_story - Sending error response:", errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Call your FastAPI endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiUrl = `${backendUrl}/stories/initialize_story`;
    const params = new URLSearchParams();
    params.append("user_id", body.user_id);
    params.append("story_type", body.story_type);
    if (body.story_title) params.append("story_title", body.story_title);

    const apiResponse = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      console.error("initialize_story - API error response:", text);
      return NextResponse.json({ status: "error", message: "API call failed" }, { status: 500 });
    }

    const data = await apiResponse.json();
    console.log("initialize_story - API response:", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error("initialize_story - Error:", error);
    const errorResponse = { status: "error", message: "Internal server error" };
    console.log("initialize_story - Sending error response:", errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
