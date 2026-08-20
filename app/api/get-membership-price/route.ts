import { NextResponse } from "next/server";

import { getMembershipPrice } from "@/app/lib/stripeServer";

export const runtime = "nodejs";

export async function GET() {
  try {
    const price = await getMembershipPrice();

    return NextResponse.json({
      amount: price.unit_amount,
      currency: price.currency.toUpperCase(),
    });
  } catch (error) {
    console.error("Stripe price fetch failed:", error);
    return NextResponse.json({ error: "The membership price is unavailable." }, { status: 503 });
  }
}
