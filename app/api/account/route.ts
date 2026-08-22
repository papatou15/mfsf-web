import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getSanityServerClient } from "@/app/lib/sanityServerClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accountMemberQuery = `
  *[
    _type == "inscription" &&
    !(_id in path("drafts.**")) &&
    (
      lower(email) in $emails ||
      ($hasFullName && lower(nom) == $firstName && lower(nom_famille) == $lastName)
    )
  ]{
    _id,
    nom,
    nom_famille,
    email,
    zip_code,
    phone[]{_key, phone_type, phone_no, phone_notes},
    member_form{adhesionTime, renewTime},
    linkedActivities[]{
      _key,
      date,
      activityId->{nom}
    },
    "newsletter": *[
      _type == "newsletterSubscriber" &&
      (member._ref == ^._id || lower(email) == lower(^.email))
    ] | order(lastSyncedAt desc)[0]{status, consentAt, unsubscribedAt},
    member_check,
    "matchedByEmail": lower(email) in $emails
  }
`;

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ member: null }, { status: 401 });

  const emails = [...new Set(
    user.emailAddresses
      .map(({ emailAddress }) => emailAddress.trim().toLowerCase())
      .filter(Boolean),
  )];
  const firstName = (user.firstName ?? "").trim().toLowerCase();
  const lastName = (user.lastName ?? "").trim().toLowerCase();
  const hasFullName = Boolean(firstName && lastName);

  if (!emails.length && !hasFullName) {
    return NextResponse.json({ member: null });
  }

  try {
    const candidates = await getSanityServerClient().fetch<Array<Record<string, unknown> & { matchedByEmail: boolean }>>(
      accountMemberQuery,
      { emails, firstName, lastName, hasFullName },
    );
    const emailMatches = candidates.filter(({ matchedByEmail }) => matchedByEmail);
    const nameMatches = candidates.filter(({ matchedByEmail }) => !matchedByEmail);

    // Email is authoritative. A name-only match is accepted only when it is unique.
    const selectedMember = emailMatches[0] ?? (nameMatches.length === 1 ? nameMatches[0] : null);
    const member = selectedMember
      ? Object.fromEntries(Object.entries(selectedMember).filter(([key]) => key !== "matchedByEmail"))
      : null;

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Account member lookup failed:", error);
    return NextResponse.json({ member: null }, { status: 502 });
  }
}
