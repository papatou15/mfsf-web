"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Typography from "../Typography/Typography";
import typographyTheme from "../theme/Typography";
import MFButton from "../MFButton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaymentForm({setIsPaid, setTransactionId}: {setIsPaid: (status: boolean) => void; setTransactionId: (id: string | null) => void}) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm setIsPaid={setIsPaid} setTransactionId={setTransactionId}/>
    </Elements>
  );
}

function CheckoutForm({setIsPaid, setTransactionId}: {setIsPaid: (status: boolean) => void; setTransactionId: (id: string | null) => void}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("");

  // Fetch price on mount
  useEffect(() => {
    async function fetchPrice() {
      const res = await fetch("/api/get-membership-price");
      const data = await res.json();
      if (data.error) {
        setMessage("Error fetching price");
        return;
      }
      setPrice(data.amount / 100); // Convert cents to dollars
      setCurrency(data.currency.toUpperCase());
    }
    fetchPrice();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements || !price) return;

    // Create payment method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    });

    if (error) {
      setMessage(error.message || "Payment failed.");
      setLoading(false);
      return;
    }

    // Send payment method ID to backend
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price * 100, currency: currency, paymentMethodId: paymentMethod.id }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMessage("✅ Paiement réussi!");
      setIsPaid(true)
      setTransactionId(data.transactionId)
    } else {
      setMessage(`❌ Erreur de paiement: ${data.error}`);
      setIsPaid(false)
      setTransactionId(null)
    }
  };

  return (
    <div className="space-y-4 border-2 border-black rounded-xl p-5">
      {price !== null ? (
        <div className="flex flex-col">
          <Typography as={"p"} className={typographyTheme({size: "paragraph"})}>
            Frais de membre: {price}$ {currency}
          </Typography>
          <CardElement className="p-3 my-3 border-2 bg-white border-black rounded-md" />
          <MFButton
            type="button"
            disabled={!stripe || loading}
            style={"smallbg"}
            extraCSS="ml-auto"
            onClick={handlePayment} _type={"button"}
          >
            {loading ? "En cours de traitement..." : `Payer ${price}$ ${currency}`}
          </MFButton>
        </div>
      ) : (
        <p>Loading price...</p>
      )}
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
