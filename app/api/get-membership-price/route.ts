/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";
import "server-only";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      product: process.env.STRIPE_PRODUCT_ID,
      active: true,
    });

    if (!prices.data.length) {
      return NextResponse.json({ error: "No price found" }, { status: 404 });
    }

    const price = prices.data[0];

    return NextResponse.json({
      priceId: price.id,
      amount: price.unit_amount,
      currency: price.currency.toUpperCase(),
    });
  } catch (error: any) {
    console.error("Stripe Price Fetch Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
