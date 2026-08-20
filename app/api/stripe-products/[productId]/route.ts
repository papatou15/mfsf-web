import { NextResponse } from "next/server";

import { getSanityStripePrice } from "@/app/lib/sanityStripeProducts";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { productId } = await context.params;
    const { product, price } = await getSanityStripePrice(productId);

    return NextResponse.json({
      nom: product.nom,
      description: product.description ?? "",
      amount: price.unit_amount,
      currency: price.currency.toUpperCase(),
    });
  } catch (error) {
    console.error("Stripe product lookup failed:", error);
    return NextResponse.json({ error: "Ce produit est temporairement indisponible." }, { status: 404 });
  }
}
