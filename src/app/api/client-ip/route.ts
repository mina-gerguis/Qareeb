import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  let ip = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip");

  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    ip = request.headers.get("cf-connecting-ip") || ip || "127.0.0.1";
  }

  return NextResponse.json({ ip });
}
