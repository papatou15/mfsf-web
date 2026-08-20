import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const contactFormSchema = z.object({
  _type: z.literal("contactForm"),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(10_000),
});

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json({ success: false }, { status: 503 });
  }

  const rawBody = await request.text();
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("SANITY_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ success: false }, { status: 503 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
  if (!(await isValidSignature(rawBody, signature, webhookSecret))) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { email, subject, message } = parsed.data;
  const from = process.env.CONTACT_NOTIFICATION_FROM;
  const recipients = (process.env.CONTACT_NOTIFICATION_TO ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!from || recipients.length === 0) {
    console.error("Contact notification addresses are not configured");
    return NextResponse.json({ success: false }, { status: 503 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: recipients,
      replyTo: email,
      subject: `Nouvelle question : ${subject}`,
      text: `Une nouvelle question a ete envoyee depuis le formulaire de contact.\n\nSujet : ${subject}\nCourriel : ${email}\n\nMessage :\n${message}`,
    });

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact notification:", error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
