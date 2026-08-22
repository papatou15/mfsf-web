"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {FaCheckCircle} from "react-icons/fa";

import MFButton from "./MFButton";
import inputTheme from "./theme/Input";

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const reduceMotion = useReducedMotion();

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
    <form onSubmit={handleSubmit} className="w-full max-w-xl overflow-visible [perspective:1000px]" noValidate>
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="newsletter-success"
            role="status"
            aria-live="polite"
            initial={reduceMotion
              ? {opacity: 0}
              : {
                  opacity: 0,
                  x: -220,
                  y: 40,
                  rotate: -8,
                  scaleX: 1.25,
                  scaleY: 0.92,
                  filter: "blur(6px)",
                }}
            animate={reduceMotion
              ? {opacity: 1}
              : {
                  opacity: [0, 1, 1, 1],
                  x: [-220, 18, -8, 0],
                  y: [40, -6, 2, 0],
                  rotate: [-8, 2, -1, 0],
                  scaleX: [1.25, 0.96, 1.02, 1],
                  scaleY: [0.92, 1.03, 0.99, 1],
                  filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(0px)"],
                }}
            transition={reduceMotion
              ? {duration: 0.2}
              : {duration: 0.9, times: [0, 0.68, 0.86, 1], ease: [0.16, 1, 0.3, 1]}}
            className="mx-auto flex min-h-72 w-[90%] origin-center flex-col items-center justify-center rounded-3xl border-2 border-black bg-white/90 p-8 text-center shadow-big-box-bg"
          >
            <FaCheckCircle aria-hidden="true" className="mb-5 text-6xl text-primary-green" />
            <h4 className="text-4xl font-bold">Merci!</h4>
            <p className="mt-3 text-lg">Votre inscription à l’infolettre est confirmée.</p>
          </motion.div>
        ) : (
          <motion.div
            key="newsletter-form"
            initial={{opacity: 1, rotate: 0, scale: 1, skewX: 0, filter: "blur(0px)"}}
            animate={{opacity: 1, rotate: 0, scale: 1, skewX: 0, filter: "blur(0px)"}}
            exit={reduceMotion
              ? {opacity: 0}
              : {
                  opacity: [1, 1, 0.9, 0.45, 0],
                  x: [0, 105, 165, 70, -170],
                  y: [0, -8, 60, 155, 95],
                  rotate: [0, 2, 12, 28, 42],
                  scaleX: [1, 1.28, 1.14, 0.96, 0.86],
                  scaleY: [1, 0.92, 0.98, 1.02, 0.94],
                  filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(3px)", "blur(7px)"],
                }}
            transition={reduceMotion
              ? {duration: 0.2}
              : {duration: 1.2, times: [0, 0.24, 0.48, 0.76, 1], ease: [0.45, 0, 0.25, 1]}}
            className="flex w-full origin-center flex-col items-center gap-5"
          >
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
            {status === "error" ? <p role="alert">L’inscription a échoué. Réessayez un peu plus tard.</p> : null}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
