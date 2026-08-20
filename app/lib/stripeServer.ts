import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured.");

  stripeClient ??= new Stripe(secretKey, {
    apiVersion: "2025-01-27.acacia",
  });

  return stripeClient;
}

export async function getMembershipPrice() {
  const stripe = getStripeClient();
  const priceId = process.env.STRIPE_MEMBERSHIP_PRICE_ID;

  if (priceId) {
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.unit_amount === null) {
      throw new Error("The configured membership price is inactive or has no fixed amount.");
    }
    return price;
  }

  const productId = process.env.STRIPE_MEMBERSHIP_PRODUCT_ID;
  if (!productId) {
    throw new Error("Configure STRIPE_MEMBERSHIP_PRICE_ID or STRIPE_MEMBERSHIP_PRODUCT_ID.");
  }

  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 2,
  });

  const fixedPrices = prices.data.filter((price) => price.unit_amount !== null);
  if (fixedPrices.length !== 1) {
    throw new Error("The membership product must have exactly one active fixed price, or STRIPE_MEMBERSHIP_PRICE_ID must be configured.");
  }

  return fixedPrices[0];
}
