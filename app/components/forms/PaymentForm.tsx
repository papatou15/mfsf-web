"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

import MFButton from "../MFButton";
import Typography from "../Typography/Typography";
import typographyTheme from "../theme/Typography";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type PaymentFormProps = {
  setIsPaid: (status: boolean) => void;
  setTransactionId: (id: string | null) => void;
  sanityProductId?: string;
  activityId?: string;
  disabled?: boolean;
};

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}

function CheckoutForm({
  setIsPaid,
  setTransactionId,
  sanityProductId,
  activityId,
  disabled = false,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const idempotencyKey = useRef(crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const isActivityPayment = Boolean(sanityProductId && activityId);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const endpoint = sanityProductId
          ? `/api/stripe-products/${encodeURIComponent(sanityProductId)}`
          : "/api/get-membership-price";
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok || typeof data.amount !== "number") {
          throw new Error("Le prix est indisponible.");
        }

        setPrice(data.amount / 100);
        setCurrency(data.currency);
        setProductName(data.nom ?? "");
        setDescription(data.description ?? "");
      } catch {
        setMessage("Impossible de charger le prix.");
      }
    }

    fetchPrice();
  }, [sanityProductId]);

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");
    setIsPaid(false);
    setTransactionId(null);

    const card = elements?.getElement(CardElement);
    if (!stripe || !card || price === null) {
      setMessage("Le formulaire de paiement n’est pas prêt.");
      setLoading(false);
      return;
    }

    if (sanityProductId && !activityId) {
      setMessage("Cette activité n’est pas correctement configurée.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(isActivityPayment ? "/api/stripe-payments" : "/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isActivityPayment ? {
          idempotencyKey: idempotencyKey.current,
          productId: sanityProductId,
          activityId,
        } : {
          idempotencyKey: idempotencyKey.current,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.clientSecret) {
        throw new Error(data.error || "Le paiement n’a pas pu être initialisé.");
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (result.error) throw result.error;
      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error("Le paiement n’a pas été complété.");
      }

      setMessage("✅ Paiement réussi!");
      setIsPaid(true);
      setTransactionId(result.paymentIntent.id);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Paiement refusé.";
      setMessage(`❌ Erreur de paiement: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border-2 border-black rounded-xl p-5">
      {price !== null ? (
        <div className="flex flex-col">
          {productName && (
            <Typography as="h3" className={typographyTheme({size: "h5"})}>
              {productName}
            </Typography>
          )}
          {description && <p>{description}</p>}
          <Typography as="p" className={typographyTheme({size: "paragraph"})}>
            Montant: {price.toFixed(2)} $ {currency}
          </Typography>
          <CardElement className="p-3 my-3 border-2 bg-white border-black rounded-md" />
          <MFButton
            type="button"
            disabled={disabled || !stripe || loading}
            style="smallbg"
            extraCSS="ml-auto"
            onClick={handlePayment}
            _type="button"
          >
            {loading ? "En cours de traitement..." : `Payer ${price.toFixed(2)} $ ${currency}`}
          </MFButton>
        </div>
      ) : (
        <p>Chargement du prix...</p>
      )}
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
