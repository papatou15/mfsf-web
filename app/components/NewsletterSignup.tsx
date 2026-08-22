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
                  rotate: -720,
                  rotateX: 120,
                  rotateY: -140,
                  scaleX: 0.05,
                  scaleY: 1.8,
                  skewX: -65,
                  skewY: 40,
                  filter: "blur(18px)",
                }}
            animate={reduceMotion
              ? {opacity: 1}
              : {
                  opacity: [0, 0.85, 1, 1],
                  rotate: [-720, -150, 20, 0],
                  rotateX: [120, -40, 14, 0],
                  rotateY: [-140, 50, -12, 0],
                  scaleX: [0.05, 1.45, 0.84, 1],
                  scaleY: [1.8, 0.52, 1.18, 1],
                  skewX: [-65, 38, -10, 0],
                  skewY: [40, -24, 7, 0],
                  filter: ["blur(18px)", "blur(5px)", "blur(1px)", "blur(0px)"],
                }}
            transition={reduceMotion
              ? {duration: 0.2}
              : {duration: 1.25, times: [0, 0.55, 0.82, 1], ease: [0.16, 1, 0.3, 1]}}
            className="mx-auto flex min-h-72 w-[90%] origin-center flex-col items-center justify-center rounded-3xl border-2 border-black bg-white/90 p-8 text-center shadow-big-box-bg [backface-visibility:hidden] [transform-style:preserve-3d]"
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
                  opacity: [1, 1, 0.75, 0],
                  rotate: [0, 170, 480, 900],
                  rotateX: [0, 42, -85, 130],
                  rotateY: [0, -68, 105, -155],
                  scaleX: [1, 1.42, 0.2, 0],
                  scaleY: [1, 0.5, 1.55, 0],
                  skewX: [0, 30, -48, 72],
                  skewY: [0, -18, 34, -52],
                  x: [0, 20, -28, 0],
                  y: [0, -14, 24, 0],
                  filter: ["blur(0px)", "blur(3px)", "blur(9px)", "blur(20px)"],
                }}
            transition={reduceMotion
              ? {duration: 0.2}
              : {duration: 1.05, times: [0, 0.38, 0.72, 1], ease: "easeInOut"}}
            className="flex w-full origin-center flex-col items-center gap-5 [backface-visibility:hidden] [transform-style:preserve-3d]"
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
