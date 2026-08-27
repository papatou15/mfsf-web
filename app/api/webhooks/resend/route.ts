import {createHash} from "node:crypto";
import {NextResponse} from "next/server";
import {Webhook} from "svix";

import {getSanityServerClient} from "@/app/lib/sanityServerClient";
import {findMemberForNewsletter, upsertNewsletterSubscriber} from "@/app/lib/newsletterSubscriber";

export const runtime = "nodejs";

type ContactEvent = {
  type: "contact.created" | "contact.updated" | "contact.deleted";
  created_at: string;
  data: {
    id: string;
    email: string;
    unsubscribed?: boolean;
  };
};

function resendRequest(path: string, apiKey: string) {
  return fetch(`https://api.resend.com${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "mfsf-web/1.0",
    },
    cache: "no-store",
  });
}

async function isSubscribedToNewsletter(email: string, globallyUnsubscribed: boolean, apiKey: string, topicId: string) {
  if (globallyUnsubscribed) return false;

  const response = await resendRequest(`/contacts/${encodeURIComponent(email)}/topics`, apiKey);
  if (!response.ok) throw new Error(`Resend topic lookup failed (${response.status}).`);
  const body = (await response.json()) as {data?: Array<{id: string; subscription: "opt_in" | "opt_out"}>};
  return body.data?.some((topic) => topic.id === topicId && topic.subscription === "opt_in") ?? false;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID;
  if (!webhookSecret || !apiKey || !topicId) {
    console.error("Resend webhook configuration is incomplete.");
    return NextResponse.json({success: false}, {status: 503});
  }

  const payload = await request.text();
  let event: ContactEvent;
  try {
    event = new Webhook(webhookSecret).verify(payload, {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    }) as ContactEvent;
  } catch {
    return NextResponse.json({success: false}, {status: 400});
  }

  if (!["contact.created", "contact.updated", "contact.deleted"].includes(event.type)) {
    return NextResponse.json({success: true});
  }

  try {
    const sanity = getSanityServerClient();
    const memberId = await findMemberForNewsletter(sanity, event.data.email);
    const deleted = event.type === "contact.deleted";
    const subscribed = deleted
      ? false
      : await isSubscribedToNewsletter(event.data.email, Boolean(event.data.unsubscribed), apiKey, topicId);
    const status = deleted ? "deleted" : subscribed ? "subscribed" : "unsubscribed";
    const {subscriberId, stale} = await upsertNewsletterSubscriber(sanity, {
      email: event.data.email,
      status,
      syncedAt: event.created_at,
      memberId,
      resendContactId: event.data.id,
    });

    const providerEventId = request.headers.get("svix-id") ?? createHash("sha256").update(payload).digest("hex");
    const historyId = `newsletterSubscription.webhook.${createHash("sha256").update(providerEventId).digest("hex")}`;
    await sanity.createIfNotExists({
      _id: historyId,
      _type: "newsletterSubscription",
      email: event.data.email.trim().toLowerCase(),
      consent: false,
      consentAt: event.created_at,
      source: "Synchronisation automatique Resend",
      eventType: event.type,
      status,
      providerEventId,
      resendContactId: event.data.id,
      subscriber: {_type: "reference", _ref: subscriberId},
      ...(memberId ? {member: {_type: "reference", _ref: memberId}} : {}),
    });

    return NextResponse.json({success: true, stale});
  } catch (error) {
    console.error("Resend webhook synchronization failed:", error);
    return NextResponse.json({success: false}, {status: 502});
  }
}
