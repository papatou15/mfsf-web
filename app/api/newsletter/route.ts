import {NextResponse} from "next/server";
import {z} from "zod";

import {getSanityServerClient} from "@/app/lib/sanityServerClient";
import {findMemberForNewsletter, upsertNewsletterSubscriber} from "@/app/lib/newsletterSubscriber";

export const runtime = "nodejs";

const POLICY_VERSION = "2026-08-20";

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  consent: z.literal(true),
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

async function resendRequest(path: string, apiKey: string, init: RequestInit = {}) {
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "mfsf-web/1.0",
      ...init.headers,
    },
    cache: "no-store",
  });
}

async function subscribeInResend(email: string, apiKey: string, topicId: string) {
  const encodedEmail = encodeURIComponent(email);
  const existing = await resendRequest(`/contacts/${encodedEmail}`, apiKey);

  if (existing.status === 404) {
    const created = await resendRequest("/contacts", apiKey, {
      method: "POST",
      body: JSON.stringify({
        email,
        unsubscribed: false,
        topics: [{id: topicId, subscription: "opt_in"}],
      }),
    });

    if (!created.ok) throw new Error(`Resend contact creation failed (${created.status}).`);
    const body = (await created.json()) as {id?: string};
    return body.id;
  }

  if (!existing.ok) throw new Error(`Resend contact lookup failed (${existing.status}).`);

  const contact = (await existing.json()) as {id?: string};
  const globalUpdate = await resendRequest(`/contacts/${encodedEmail}`, apiKey, {
    method: "PATCH",
    body: JSON.stringify({unsubscribed: false}),
  });
  if (!globalUpdate.ok) throw new Error(`Resend contact update failed (${globalUpdate.status}).`);

  const topicUpdate = await resendRequest(`/contacts/${encodedEmail}/topics`, apiKey, {
    method: "PATCH",
    body: JSON.stringify({topics: [{id: topicId, subscription: "opt_in"}]}),
  });
  if (!topicUpdate.ok) throw new Error(`Resend topic update failed (${topicUpdate.status}).`);

  return contact.id;
}

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({success: false}, {status: 403});
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({success: false}, {status: 400});
  }

  const parsed = newsletterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({success: false}, {status: 400});
  }

  const apiKey = process.env.RESEND_API_KEY;
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID;
  if (!apiKey || !topicId) {
    console.error("Newsletter Resend configuration is incomplete.");
    return NextResponse.json({success: false}, {status: 503});
  }

  const sanity = getSanityServerClient();
  const consentAt = new Date().toISOString();
  const record = await sanity.create({
    _type: "newsletterSubscription",
    email: parsed.data.email,
    consent: true,
    consentAt,
    source: "Formulaire de la page d’accueil",
    privacyPolicyVersion: POLICY_VERSION,
    status: "pending",
  });

  try {
    const resendContactId = await subscribeInResend(parsed.data.email, apiKey, topicId);
    const memberId = await findMemberForNewsletter(sanity, parsed.data.email);
    const {subscriberId} = await upsertNewsletterSubscriber(sanity, {
      email: parsed.data.email,
      status: "subscribed",
      syncedAt: consentAt,
      memberId,
      resendContactId,
      consentAt,
      consentSource: "Formulaire de la page d’accueil",
      privacyPolicyVersion: POLICY_VERSION,
    });
    await sanity.patch(record._id).set({
      status: "subscribed",
      subscriber: {_type: "reference", _ref: subscriberId},
      ...(memberId ? {member: {_type: "reference", _ref: memberId}} : {}),
      ...(resendContactId ? {resendContactId} : {}),
    }).commit();
    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    await sanity.patch(record._id).set({status: "error"}).commit().catch(() => undefined);
    return NextResponse.json({success: false}, {status: 502});
  }
}
