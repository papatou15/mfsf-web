import { NextResponse } from "next/server";
import { z } from "zod";

import { getSanityServerClient } from "@/app/lib/sanityServerClient";

export const runtime = "nodejs";

const contactSchema = z.object({
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(10_000),
  website: z.string().max(0).optional(),
});

function hasValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const sanity = getSanityServerClient();
    await sanity.create({
      _type: "contactForm",
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
