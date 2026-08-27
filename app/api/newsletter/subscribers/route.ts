import {timingSafeEqual} from "node:crypto";
import {NextResponse} from "next/server";

import {getSanityServerClient} from "@/app/lib/sanityServerClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasValidToken(request: Request, expected: string) {
  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export async function GET(request: Request) {
  const token = process.env.NEWSLETTER_EXPORT_TOKEN;
  if (!token) {
    console.error("Newsletter export token is not configured.");
    return NextResponse.json({success: false}, {status: 503});
  }
  if (!hasValidToken(request, token)) {
    return NextResponse.json({success: false}, {status: 401});
  }

  try {
    const subscribers = await getSanityServerClient().fetch(`
      *[_type == "newsletterSubscriber" && status == "subscribed"] | order(email asc) {
        email,
        "firstName": member->nom,
        "lastName": member->nom_famille,
        consentAt,
        "source": consentSource,
        privacyPolicyVersion,
        "externalId": resendContactId
      }
    `);

    return NextResponse.json(
      {generatedAt: new Date().toISOString(), subscribers},
      {headers: {"Cache-Control": "private, no-store, max-age=0"}},
    );
  } catch (error) {
    console.error("Newsletter export failed:", error);
    return NextResponse.json({success: false}, {status: 502});
  }
}
