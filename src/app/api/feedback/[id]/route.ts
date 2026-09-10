import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";
import { Feedback } from "@/models/Feedback";

async function isAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const feedback = await Feedback.findByIdAndDelete(id);
    return feedback ? NextResponse.json({ message: "Feedback deleted." }) : NextResponse.json({ error: "Feedback not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Could not delete feedback." }, { status: 500 });
  }
}
