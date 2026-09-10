import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";
import { Enquiry } from "@/models/Enquiry";

async function isAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { status } = await request.json();
    if (!["new", "in-progress", "closed"].includes(status)) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
    const { id } = await context.params;
    await connectToDatabase();
    const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return enquiry ? NextResponse.json(enquiry) : NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Could not update enquiry." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const enquiry = await Enquiry.findByIdAndDelete(id);
    return enquiry ? NextResponse.json({ message: "Enquiry deleted." }) : NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Could not delete enquiry." }, { status: 500 });
  }
}
