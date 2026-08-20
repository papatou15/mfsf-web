import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getSanityServerClient } from "@/app/lib/sanityServerClient";
import { getMembershipPrice, getStripeClient } from "@/app/lib/stripeServer";

export const runtime = "nodejs";

const membershipSchema = z.object({
  formId: z.string().trim().min(1).max(200),
  paymentIntentId: z.string().trim().startsWith("pi_").max(200).nullable().optional(),
  selectedDate: z.string().trim().max(100).nullable().optional(),
  answers: z.array(z.object({
    question: z.string().trim().min(1).max(300),
    response: z.string().trim().max(10_000),
  })).max(100),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const parsed = membershipSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!user || !email) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const sanity = getSanityServerClient();
    const [formId, existingMemberId] = await Promise.all([
      sanity.fetch<string | null>(
        `*[_type == "formulaires" && _id == $formId && formTitle match "*nscription*"][0]._id`,
        { formId: parsed.data.formId },
      ),
      sanity.fetch<string | null>(
        `*[_type == "inscription" && email == $email][0]._id`,
        { email },
      ),
    ]);

    if (!formId) return NextResponse.json({ success: false }, { status: 400 });
    if (existingMemberId) return NextResponse.json({ success: false }, { status: 409 });

    const now = new Date();
    let memberForm: {
      paidMethod: string;
      paidTime: string;
      adhesionTime: string;
      renewTime: string;
      transactionId: string;
    } | undefined;

    if (parsed.data.paymentIntentId) {
      const stripe = getStripeClient();
      const [expectedPrice, paymentIntent, alreadyUsed] = await Promise.all([
        getMembershipPrice(),
        stripe.paymentIntents.retrieve(parsed.data.paymentIntentId),
        sanity.fetch<number>(
          `count(*[_type == "inscription" && member_form.transactionId == $transactionId])`,
          { transactionId: parsed.data.paymentIntentId },
        ),
      ]);

      const validPayment =
        !alreadyUsed &&
        paymentIntent.status === "succeeded" &&
        paymentIntent.amount === expectedPrice.unit_amount &&
        paymentIntent.currency === expectedPrice.currency &&
        paymentIntent.metadata.clerkUserId === userId &&
        paymentIntent.metadata.purpose === "membership";

      if (!validPayment) {
        return NextResponse.json({ success: false }, { status: 400 });
      }

      const paidAt = new Date(paymentIntent.created * 1000);
      memberForm = {
        paidMethod: "credit",
        paidTime: paidAt.toISOString(),
        adhesionTime: now.toISOString(),
        renewTime: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString(),
        transactionId: paymentIntent.id,
      };
    }

    const memberId = `inscription.${crypto.randomUUID()}`;
    await sanity
      .transaction()
      .create({
        _id: memberId,
        _type: "inscription",
        nom: user.firstName ?? "",
        nom_famille: user.lastName ?? "",
        email,
        member_check: true,
        ...(memberForm ? { member_form: memberForm } : {}),
      })
      .patch(formId, (patch) => patch
        .setIfMissing({ submissions: [] })
        .append("submissions", [{
          _type: "submission",
          _key: crypto.randomUUID(),
          submittedAt: now.toISOString(),
          user: { _type: "reference", _ref: memberId },
          selectedDate: parsed.data.selectedDate ?? null,
          answers: parsed.data.answers.map((answer) => ({
            _type: "answer",
            _key: crypto.randomUUID(),
            ...answer,
          })),
        }]))
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Membership registration failed:", error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
