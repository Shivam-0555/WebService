import { SignJWT, jwtVerify } from "jose";

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Please define JWT_SECRET in your environment variables");
  return new TextEncoder().encode(secret);
}

export async function createAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
