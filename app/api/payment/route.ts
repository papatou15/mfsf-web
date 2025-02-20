/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { z } from "zod";
import "server-only"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});


const PaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(3).max(3),
  paymentMethodId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = PaymentSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { amount, currency, paymentMethodId } = parsedBody.data;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      }
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id
    });
  } catch (error: any) {
    console.error("Payment Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
