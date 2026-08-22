"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import MFButton from "./MFButton";
import inputTheme from "./theme/Input";

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          consent: data.get("consent") === "on",
          website: String(data.get("website") ?? ""),
        }),
      });

      if (!response.ok) throw new Error("Newsletter subscription failed.");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col items-center gap-5" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label htmlFor="newsletter-email" className="sr-only">Votre adresse courriel</label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Votre adresse courriel"
        className={`${inputTheme()} bg-off-white w-[75%] xl:w-full mt-10`}
      />
      <label className="flex max-w-lg items-start gap-3 text-sm">
        <input name="consent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0" />
        <span>
          J’accepte de recevoir l’infolettre de la Maison de la Famille de St-François. Je peux retirer
          mon consentement en tout temps. Consultez notre{" "}
          <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
        </span>
      </label>
      <MFButton
        _type="button"
        type="submit"
        style="coloredbg"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Inscription en cours…" : "S’inscrire"}
      </MFButton>
      {status === "success" ? <p role="status">Votre inscription à l’infolettre est confirmée.</p> : null}
      {status === "error" ? <p role="alert">L’inscription a échoué. Réessayez un peu plus tard.</p> : null}
    </form>
  );
}
