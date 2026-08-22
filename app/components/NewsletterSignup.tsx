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
      <AnimatePresence initial={false}>
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
                  y: 55,
                  rotate: -7,
                  scaleX: 1.18,
                  scaleY: 0.96,
                }}
            animate={reduceMotion
              ? {opacity: 1}
              : {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scaleX: 1,
                  scaleY: 1,
                }}
            transition={reduceMotion
              ? {duration: 0.2}
              : {
                  opacity: {duration: 0.35, delay: 0.62},
                  x: {type: "spring", stiffness: 72, damping: 17, mass: 0.9, delay: 0.58},
                  y: {type: "spring", stiffness: 78, damping: 18, mass: 0.85, delay: 0.58},
                  rotate: {type: "spring", stiffness: 82, damping: 19, delay: 0.58},
                  scaleX: {type: "spring", stiffness: 90, damping: 18, delay: 0.58},
                  scaleY: {type: "spring", stiffness: 90, damping: 18, delay: 0.58},
                }}
            className="mx-auto flex w-fit max-w-md origin-center flex-col items-center justify-center p-4 text-center"
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
                  opacity: [1, 1, 0.96, 0.6, 0],
                  x: [0, 90, 155, 85, -145],
                  y: [0, -5, 48, 135, 100],
                  rotate: [0, 1, 8, 20, 30],
                  scaleX: [1, 1.22, 1.12, 0.98, 0.9],
                  scaleY: [1, 0.95, 0.98, 1.01, 0.96],
                }}
            transition={reduceMotion
              ? {duration: 0.2}
              : {duration: 1.35, times: [0, 0.25, 0.5, 0.76, 1], ease: [0.4, 0, 0.2, 1]}}
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
