import {createHash} from "node:crypto";
import type {SanityClient} from "@sanity/client";

export type NewsletterStatus = "subscribed" | "unsubscribed" | "deleted" | "error";

export function normalizeNewsletterEmail(email: string) {
  return email.trim().toLowerCase();
}

export function newsletterSubscriberId(email: string) {
  const digest = createHash("sha256").update(normalizeNewsletterEmail(email)).digest("hex");
  return `newsletterSubscriber.${digest}`;
}

export async function findMemberForNewsletter(sanity: SanityClient, email: string) {
  const matches = await sanity.fetch<string[]>(
    `*[_type == "inscription" && !(_id in path("drafts.**")) && lower(email) == $email][0...2]._id`,
    {email: normalizeNewsletterEmail(email)},
  );

  // Do not guess when duplicate member records share the same address.
  return matches.length === 1 ? matches[0] : null;
}

type SubscriberUpdate = {
  email: string;
  status: NewsletterStatus;
  syncedAt: string;
  memberId?: string | null;
  resendContactId?: string;
  consentAt?: string;
  consentSource?: string;
  privacyPolicyVersion?: string;
};

export async function upsertNewsletterSubscriber(sanity: SanityClient, update: SubscriberUpdate) {
  const email = normalizeNewsletterEmail(update.email);
  const subscriberId = newsletterSubscriberId(email);
  const memberId = update.memberId === undefined
    ? await findMemberForNewsletter(sanity, email)
    : update.memberId;
  const existing = await sanity.fetch<{lastSyncedAt?: string} | null>(
    `*[_id == $subscriberId][0]{lastSyncedAt}`,
    {subscriberId},
  );

  // Resend can retry or deliver events out of order. Never let an older event
  // overwrite a more recent subscription state.
  if (existing?.lastSyncedAt && existing.lastSyncedAt > update.syncedAt) {
    if (update.consentAt) {
      await sanity.patch(subscriberId).set({
        consentAt: update.consentAt,
        ...(update.consentSource ? {consentSource: update.consentSource} : {}),
        ...(update.privacyPolicyVersion ? {privacyPolicyVersion: update.privacyPolicyVersion} : {}),
        ...(memberId ? {member: {_type: "reference", _ref: memberId}} : {}),
        ...(update.resendContactId ? {resendContactId: update.resendContactId} : {}),
      }).commit();
    }
    return {subscriberId, memberId, stale: true};
  }

  const set: Record<string, unknown> = {
    email,
    status: update.status,
    lastSyncedAt: update.syncedAt,
    ...(memberId ? {member: {_type: "reference", _ref: memberId}} : {}),
    ...(update.resendContactId ? {resendContactId: update.resendContactId} : {}),
    ...(update.consentAt ? {consentAt: update.consentAt} : {}),
    ...(update.consentSource ? {consentSource: update.consentSource} : {}),
    ...(update.privacyPolicyVersion ? {privacyPolicyVersion: update.privacyPolicyVersion} : {}),
    ...(update.status === "unsubscribed" || update.status === "deleted"
      ? {unsubscribedAt: update.syncedAt}
      : {}),
  };
  const unset = [
    ...(!memberId ? ["member"] : []),
    ...(update.status === "subscribed" ? ["unsubscribedAt"] : []),
  ];

  let transaction = sanity
    .transaction()
    .createIfNotExists({_id: subscriberId, _type: "newsletterSubscriber", email})
    .patch(subscriberId, (patch) => patch.set(set));

  if (unset.length) {
    transaction = transaction.patch(subscriberId, (patch) => patch.unset(unset));
  }

  await transaction.commit();
  return {subscriberId, memberId, stale: false};
}
