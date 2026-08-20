import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getMembershipPrice, getStripeClient } from "@/app/lib/stripeServer";

export const runtime = "nodejs";

const paymentSchema = z.object({
  idempotencyKey: z.string().uuid(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const parsed = paymentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const stripe = getStripeClient();
    const price = await getMembershipPrice();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount!,
      currency: price.currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        clerkUserId: userId,
        purpose: "membership",
        stripePriceId: price.id,
      },
    }, {
      idempotencyKey: `membership:${userId}:${parsed.data.idempotencyKey}`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("PaymentIntent creation failed:", error);
    return NextResponse.json({ error: "The payment could not be initialized." }, { status: 502 });
  }
}
