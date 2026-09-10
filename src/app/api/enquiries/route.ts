import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Enquiry } from "@/models/Enquiry";
import { verifyAdminToken } from "@/lib/auth";
import { sendEnquiryNotification } from "@/lib/mail";
import { cookies } from "next/headers";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function isAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = ["name", "email", "phone", "websiteType", "budget", "requirements"];
    if (required.some((field) => typeof body[field] !== "string" || !body[field].trim())) {
      return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
    }
    if (!emailPattern.test(body.email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    await connectToDatabase();
    const enquiry = await Enquiry.create({ ...body, name: body.name.trim(), email: body.email.trim(), phone: body.phone.trim(), websiteType: body.websiteType.trim(), budget: body.budget.trim(), requirements: body.requirements.trim() });
    try {
      await sendEnquiryNotification(enquiry);
    } catch (error) {
      console.error("Enquiry email notification failed", error);
      return NextResponse.json({ error: "Your enquiry could not be sent right now. Please try again or contact me on WhatsApp.", saved: true, id: enquiry.id }, { status: 503 });
    }
    return NextResponse.json({ message: "Thanks! Your enquiry has been sent successfully. I'll get back to you soon.", id: enquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save your enquiry right now." }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(enquiries);
  } catch {
    return NextResponse.json({ error: "Could not load enquiries." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, status } = await request.json();
    if (!id || !["new", "in-progress", "closed"].includes(status)) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
    await connectToDatabase();
    const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return enquiry ? NextResponse.json(enquiry) : NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Could not update enquiry." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    await connectToDatabase();
    await Enquiry.findByIdAndDelete(id);
    return NextResponse.json({ message: "Enquiry deleted." });
  } catch {
    return NextResponse.json({ error: "Could not delete enquiry." }, { status: 500 });
  }
}
