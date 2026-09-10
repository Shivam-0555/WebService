import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const validEmail = email && email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const validPassword = passwordHash ? await bcrypt.compare(password ?? "", passwordHash) : password === process.env.ADMIN_PASSWORD;
    if (!validEmail || !validPassword) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    const token = await createAdminToken();
    const response = NextResponse.json({ message: "Signed in." });
    response.cookies.set("admin_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 8, path: "/" });
    return response;
  } catch {
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
