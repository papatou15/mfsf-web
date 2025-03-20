"use client"

import React, { useState } from "react";
import inputTheme from "../theme/Input";
import formLabelTheme from "../theme/FormLabel";
import typographyTheme from "../theme/Typography";
import { sanityClient } from "@/app/sanityClient";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const data = {
      _type: "contactForm",
      email: email,
      subject: subject,
      message: question,
      createdAt: new Date().toISOString()
    }
    sanityClient.create(data)
      .then(response => {
        console.log(response);
        setLoading(false);
        setSuccess(true);
      })
      .catch(err => {
        console.error("Error creating document:", err);
        if (err.statusCode === 403) {
          alert("You do not have permission to submit this form.");
        } else {
          alert("An error occurred while submitting the form. Please try again later.");
        }
      });
  }

  return (
    <>
      {success == false && <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="name" className={`${formLabelTheme()} ${typographyTheme({ size: 'paragraph' })} text-off-white`}>Ton courriel</label>
        <input type="email" id="Courriel" name="email" required onChange={(e) => setEmail(e.target.value)} className={inputTheme()} />

        <label htmlFor="email" className={`${formLabelTheme()} ${typographyTheme({ size: 'paragraph' })} text-off-white`}>Sujet</label>
        <input type="text" id="Sujet" name="subject" required onChange={(e) => setSubject(e.target.value)} className={inputTheme()} />

        <label htmlFor="question" className={`${formLabelTheme()} ${typographyTheme({ size: 'paragraph' })} text-off-white`}>Question</label>
        <textarea id="Question" name="question" rows={10} required onChange={(e) => setQuestion(e.target.value)} className={inputTheme()} />

        <MFButton style="smallbg" type="submit" extraCSS="w-1/3 ml-auto rounded-xl shadow-text-none" _type={"button"}>{loading ? "En cours d'envoi" : "Soumettre"}</MFButton>
      </form>}
    </>
  )
}
