"use client"

import React, { useState } from "react";
import inputTheme from "../theme/Input";
import formLabelTheme from "../theme/FormLabel";
import typographyTheme from "../theme/Typography";
import MFButton from "../MFButton";

export default function FormContact() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("")
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://www.formbackend.com/f/bb2f77904ac5ae5b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ email, subject, question }),
    })
    .then((response) => {
      if (response.status === 422) {
        throw new Error("Validation error");
      } else if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return response.json();
    })
    .then(data => {
      // You can even use `data` here. Access `data.submission_text`, `data.values` etc.
      console.log(data)
      setSuccessMessage(data.submission_text);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  return (
    <>
      {successMessage.length == 0 && <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="name" className={`${formLabelTheme()} ${typographyTheme({size: 'paragraph'})}`}>Ton courriel</label>
        <input type="email" id="Courriel" name="email" required onChange={(e) => setEmail(e.target.value)} className={inputTheme()}/>

        <label htmlFor="email" className={`${formLabelTheme()} ${typographyTheme({size: 'paragraph'})}`}>Sujet</label>
        <input type="text" id="Sujet" name="subject" required onChange={(e) => setSubject(e.target.value)} className={inputTheme()}/>

        <label htmlFor="question" className={`${formLabelTheme()} ${typographyTheme({size: 'paragraph'})}`}>Question</label>
        <textarea id="Question" name="question" rows={10} required onChange={(e) => setQuestion(e.target.value)} className={inputTheme()}/>

        <MFButton styling="smallbg" type="submit" extraCSS="w-1/3 ml-auto rounded-xl">Soumettre</MFButton>
      </form>}

      {successMessage.length > 0 && <p>{successMessage}</p>}
    </>
  )
}
