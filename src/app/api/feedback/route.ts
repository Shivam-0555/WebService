import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Feedback } from "@/models/Feedback";
import { verifyAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function isAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rating = Number(body.rating);
    if (typeof body.name !== "string" || !body.name.trim() || !Number.isInteger(rating) || rating < 1 || rating > 5 || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "Please add your name, a rating, and feedback." }, { status: 400 });
    }
    await connectToDatabase();
    const feedback = await Feedback.create({ name: body.name.trim(), rating, message: body.message.trim() });
    return NextResponse.json({ message: "Thank you for sharing your feedback.", feedback }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save your feedback right now." }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json(await Feedback.find().sort({ createdAt: -1 }).lean());
  } catch {
    return NextResponse.json({ error: "Could not load feedback." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    await connectToDatabase();
    await Feedback.findByIdAndDelete(id);
    return NextResponse.json({ message: "Feedback deleted." });
  } catch {
    return NextResponse.json({ error: "Could not delete feedback." }, { status: 500 });
  }
}
