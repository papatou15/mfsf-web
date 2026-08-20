import "server-only";

import { getSanityServerClient } from "@/app/lib/sanityServerClient";
import { getStripeClient } from "@/app/lib/stripeServer";

export type SanityStripeProduct = {
  _id: string;
  nom: string;
  description?: string;
  prixStripeId: string;
};

export type SanityActivityPayment = {
  _id: string;
  nom: string;
  produitStripeId?: string;
  dates?: Array<{
    date?: string;
    inscriptionOuverte?: boolean;
    isVisible?: boolean;
    openDate?: string;
  }>;
};

export async function getSanityStripeProduct(productId: string) {
  const sanity = getSanityServerClient();
  return sanity.fetch<SanityStripeProduct | null>(
    `*[_type == "produitStripe" && _id == $productId && actif != false][0]{
      _id,
      nom,
      description,
      prixStripeId
    }`,
    { productId },
  );
}

export async function getSanityActivityPayment(activityId: string) {
  const sanity = getSanityServerClient();
  return sanity.fetch<SanityActivityPayment | null>(
    `*[_type == "activity" && _id == $activityId][0]{
      _id,
      nom,
      "produitStripeId": produitStripe->_id,
      dates[]{
        date,
        inscriptionOuverte,
        isVisible,
        openDate
      }
    }`,
    { activityId },
  );
}

export async function getSanityStripePrice(productId: string) {
  const product = await getSanityStripeProduct(productId);
  if (!product) throw new Error("Le produit Stripe est introuvable ou inactif.");

  const price = await getStripeClient().prices.retrieve(product.prixStripeId);
  if (!price.active || price.unit_amount === null) {
    throw new Error("Le prix Stripe est inactif ou ne possède pas de montant fixe.");
  }

  return { product, price };
}
