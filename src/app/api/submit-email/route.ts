import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwCo10kcoXozcLvH0JzxkY7OAePABuSXZLnsUGnkb9KXsvalMuqMNB6pd8tpSXQX4c74Q/exec", // 👈 replace this
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    // Log and handle non-JSON gracefully
    const text = await response.text();
    console.log("Google Script raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Google Script did not return JSON");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Failed to submit email" }, { status: 500 });
  }
}
