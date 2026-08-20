import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getSanityServerClient } from "@/app/lib/sanityServerClient";
import { getSanityActivityPayment, getSanityStripePrice } from "@/app/lib/sanityStripeProducts";
import { getStripeClient } from "@/app/lib/stripeServer";

export const runtime = "nodejs";

const submissionSchema = z.object({
  formId: z.string().trim().min(1).max(200),
  activityId: z.string().trim().min(1).max(200).nullable().optional(),
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

  const parsed = submissionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return NextResponse.json({ success: false }, { status: 403 });

    const sanity = getSanityServerClient();
    const activityPromise = parsed.data.activityId
      ? getSanityActivityPayment(parsed.data.activityId)
      : Promise.resolve(null);

    const [formId, memberId, activity] = await Promise.all([
      sanity.fetch<string | null>(`*[_type == "formulaires" && _id == $formId][0]._id`, { formId: parsed.data.formId }),
      sanity.fetch<string | null>(`*[_type == "inscription" && email == $email][0]._id`, { email }),
      activityPromise,
    ]);

    if (!formId || !memberId) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    let paymentRecord: {
      _type: "paiementStripe";
      produit: { _type: "reference"; _ref: string };
      identifiantTransaction: string;
      montant: number;
      devise: string;
      datePaiement: string;
    } | undefined;

    if (activity) {
      const selectedDate = parsed.data.selectedDate;
      const dateConfiguration = activity.dates?.find((entry) => entry.date === selectedDate);
      const registrationIsOpen =
        Boolean(selectedDate && dateConfiguration?.inscriptionOuverte && dateConfiguration?.isVisible) &&
        (!dateConfiguration?.openDate || new Date(dateConfiguration.openDate) <= new Date());

      if (!registrationIsOpen) {
        return NextResponse.json({ success: false, error: "Cette date d’inscription n’est pas ouverte." }, { status: 400 });
      }

      const linkedDate = new Date(`${selectedDate}T00:00:00.000Z`).toISOString();
      const existingRegistration = await sanity.fetch<number>(
        `count(*[
          _id == $memberId &&
          $activityId in linkedActivities[].activityId._ref &&
          $linkedDate in linkedActivities[].date
        ])`,
        { memberId, activityId: activity._id, linkedDate },
      );

      if (existingRegistration) {
        return NextResponse.json({ success: false, error: "Vous êtes déjà inscrit à cette activité." }, { status: 409 });
      }

      if (activity.produitStripeId) {
        if (!parsed.data.paymentIntentId) {
          return NextResponse.json({ success: false, error: "Le paiement est requis." }, { status: 402 });
        }

        const [{ product, price }, paymentIntent, alreadyUsed] = await Promise.all([
          getSanityStripePrice(activity.produitStripeId),
          getStripeClient().paymentIntents.retrieve(parsed.data.paymentIntentId),
          sanity.fetch<number>(
            `count(*[
              _type == "formulaires" &&
              $transactionId in submissions[].paiementStripe.identifiantTransaction
            ])`,
            { transactionId: parsed.data.paymentIntentId },
          ),
        ]);

        const validPayment =
          !alreadyUsed &&
          paymentIntent.status === "succeeded" &&
          paymentIntent.amount === price.unit_amount &&
          paymentIntent.currency === price.currency &&
          paymentIntent.metadata.clerkUserId === userId &&
          paymentIntent.metadata.purpose === "activity" &&
          paymentIntent.metadata.sanityProductId === product._id &&
          paymentIntent.metadata.sanityActivityId === activity._id;

        if (!validPayment) {
          return NextResponse.json({ success: false, error: "Le paiement n’a pas pu être vérifié." }, { status: 400 });
        }

        paymentRecord = {
          _type: "paiementStripe",
          produit: { _type: "reference", _ref: product._id },
          identifiantTransaction: paymentIntent.id,
          montant: paymentIntent.amount / 100,
          devise: paymentIntent.currency.toUpperCase(),
          datePaiement: new Date(paymentIntent.created * 1000).toISOString(),
        };
      } else if (parsed.data.paymentIntentId) {
        return NextResponse.json({ success: false }, { status: 400 });
      }
    } else if (parsed.data.activityId || parsed.data.paymentIntentId) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const now = new Date().toISOString();
    const submission = {
      _type: "submission",
      _key: crypto.randomUUID(),
      submittedAt: now,
      user: { _type: "reference", _ref: memberId },
      ...(activity ? { activity: { _type: "reference", _ref: activity._id } } : {}),
      selectedDate: parsed.data.selectedDate ?? null,
      ...(paymentRecord ? { paiementStripe: paymentRecord } : {}),
      answers: parsed.data.answers.map((answer) => ({
        _type: "answer",
        _key: crypto.randomUUID(),
        ...answer,
      })),
    };

    let transaction = sanity
      .transaction()
      .patch(formId, (patch) => patch
        .setIfMissing({ submissions: [] })
        .append("submissions", [submission]));

    if (activity && parsed.data.selectedDate) {
      const selectedDate = parsed.data.selectedDate;
      const linkedDate = new Date(`${selectedDate}T00:00:00.000Z`).toISOString();
      const membersPath = `dates[date == ${JSON.stringify(selectedDate)}].members`;

      transaction = transaction
        .patch(activity._id, (patch) => patch
          .setIfMissing({ [membersPath]: [] })
          .append(membersPath, [{ _type: "reference", _ref: memberId, _key: crypto.randomUUID() }]))
        .patch(memberId, (patch) => patch
          .setIfMissing({ linkedActivities: [] })
          .append("linkedActivities", [{
            _type: "object",
            _key: crypto.randomUUID(),
            activityId: { _type: "reference", _ref: activity._id },
            date: linkedDate,
          }]));
    }

    await transaction.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission failed:", error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
