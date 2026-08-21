"use client"

import React, { useState } from "react";
import inputTheme from "../theme/Input";
import formLabelTheme from "../theme/FormLabel";
import typographyTheme from "../theme/Typography";
import MFButton from "../MFButton";

interface FormContactProps {
  success: boolean,
  setSuccess: (loading: boolean) => void
}

export default function FormContact({ success, setSuccess }: FormContactProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false);

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
          subject,
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
        <input type="text" id="contact-subject" name="subject" required onChange={(e) => setSubject(e.target.value)} className={inputTheme()} />

        <label htmlFor="contact-question" className={`${formLabelTheme()} ${typographyTheme({ size: 'paragraph' })} text-off-white`}>Question</label>
        <textarea id="contact-question" name="question" rows={10} required onChange={(e) => setQuestion(e.target.value)} className={inputTheme()} />

        <MFButton style="smallbg" type="submit" disabled={loading} extraCSS="w-1/3 ml-auto rounded-xl shadow-text-none" _type={"button"}>{loading ? "En cours d'envoi" : "Soumettre"}</MFButton>
      </form>}
    </>
  )
}
