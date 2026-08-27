"use client"

import React, { useState } from "react";
import inputTheme from "../theme/Input";
import formLabelTheme from "../theme/FormLabel";
import typographyTheme from "../theme/Typography";
import MFButton from "../MFButton";
import Link from "next/link";

interface FormContactProps {
  success: boolean,
  setSuccess: (loading: boolean) => void,
  mode?: "default" | "collaboration"
}

const COLLABORATION_SUBJECT = "Demande de collaboration";

export default function FormContact({ success, setSuccess, mode = "default" }: FormContactProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false);
  const submittedSubject = mode === "collaboration" ? COLLABORATION_SUBJECT : subject;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject: submittedSubject,
          message: question,
          website: String(formData.get("website") ?? ""),
        }),
      });

      if (!response.ok) throw new Error("Contact submission failed.");
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Une erreur est survenue. Réessaie un peu plus tard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {success == false && <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <label htmlFor="contact-email" className={`${formLabelTheme()} ${typographyTheme({ size: 'paragraph' })} text-off-white`}>Ton courriel</label>
        <input type="email" id="contact-email" name="email" required onChange={(e) => setEmail(e.target.value)} className={inputTheme()} />

        <label htmlFor="contact-subject" className={`${formLabelTheme()} ${typographyTheme({ size: 'paragraph' })} text-off-white`}>Sujet</label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          required
          value={submittedSubject}
          readOnly={mode === "collaboration"}
          onChange={(e) => setSubject(e.target.value)}
          className={inputTheme()}
        />

        <label htmlFor="contact-question" className={`${formLabelTheme()} ${typographyTheme({ size: 'paragraph' })} text-off-white`}>
          {mode === "collaboration" ? "Parlez-nous de votre proposition" : "Question"}
        </label>
        <textarea id="contact-question" name="question" rows={10} required onChange={(e) => setQuestion(e.target.value)} className={inputTheme()} />

        <p className="mt-4 text-sm text-off-white">
          Les renseignements fournis servent uniquement à répondre à votre demande. Consultez notre{" "}
          <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
        </p>

        <MFButton style="smallbg" type="submit" disabled={loading} extraCSS="w-1/3 ml-auto rounded-xl shadow-text-none" _type={"button"}>{loading ? "En cours d'envoi" : "Soumettre"}</MFButton>
      </form>}
    </>
  )
}
