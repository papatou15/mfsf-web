import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getSanityActivityPayment, getSanityStripePrice } from "@/app/lib/sanityStripeProducts";
import { getStripeClient } from "@/app/lib/stripeServer";

export const runtime = "nodejs";

const paymentSchema = z.object({
  idempotencyKey: z.string().uuid(),
  productId: z.string().trim().min(1).max(200),
  activityId: z.string().trim().min(1).max(200),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const parsed = paymentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    const [activity, stripeProduct] = await Promise.all([
      getSanityActivityPayment(parsed.data.activityId),
      getSanityStripePrice(parsed.data.productId),
    ]);

    if (!activity || activity.produitStripeId !== stripeProduct.product._id) {
      return NextResponse.json({ error: "Ce produit n’est pas lié à cette activité." }, { status: 400 });
    }

    const paymentIntent = await getStripeClient().paymentIntents.create({
      amount: stripeProduct.price.unit_amount!,
      currency: stripeProduct.price.currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        clerkUserId: userId,
        purpose: "activity",
        sanityProductId: stripeProduct.product._id,
        sanityActivityId: activity._id,
        stripePriceId: stripeProduct.price.id,
      },
    }, {
      idempotencyKey: `activity:${activity._id}:${userId}:${parsed.data.idempotencyKey}`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Activity PaymentIntent creation failed:", error);
    return NextResponse.json({ error: "Le paiement n’a pas pu être initialisé." }, { status: 502 });
  }
}
