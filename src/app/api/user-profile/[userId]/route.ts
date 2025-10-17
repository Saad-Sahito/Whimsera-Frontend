export async function GET(request: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!backendUrl) {
    return Response.json({ detail: "Backend URL not configured" }, { status: 500 });
  }
  if (!token) {
    return Response.json({ detail: "Missing Authorization header" }, { status: 401 });
  }

  try {
    const res = await fetch(`${backendUrl}/users/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return Response.json({ detail: "Failed to fetch profile from backend" }, { status: 500 });
  }
}