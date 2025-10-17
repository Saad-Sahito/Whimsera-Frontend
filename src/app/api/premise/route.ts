import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    console.log("create_premise - Received request body:", JSON.stringify(body, null, 2));

    // Validate input
    if (!body.story_id) {
      return NextResponse.json({ error: "Missing story_id" }, { status: 400 });
    }

    // Call your FastAPI endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiUrl = `${backendUrl}/premise`;

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body), // Send the whole initial_story_data as JSON
    });

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      console.error("create_premise - API error:", text);
      return NextResponse.json({ error: "API call failed" }, { status: 500 });
    }

    const data = await apiResponse.json();
    console.log("create_premise - API response:", data);

    // Send back the actual premise returned by the API
    return NextResponse.json(data);
  } catch (error) {
    console.error("create_premise - Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
