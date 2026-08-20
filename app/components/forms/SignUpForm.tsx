"use client";

import { useEffect, useState } from "react";
import { Formulaires } from "@/sanity.types";
import FormRenderer, { FormSubmissionPayload } from "../FormRenderer";
import Typography from "../Typography/Typography";
import typographyTheme from "../theme/Typography";
import { formFetcher } from "../../queries";
import PaymentForm from "./PaymentForm";

const signUpFormQuery = `*[
    _type == "formulaires" && (formTitle match "*inscription*" || formTitle match "*Inscription*")
][0]{
    _id,
    formTitle,
    formDesc,
    sections[]{
        ...,
        revealedFields[]{...}
    }
}`;

export default function SignUpForm() {
    const [form, setForm] = useState<Formulaires | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [paymentEnabled, setPaymentEnabled] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        formFetcher(signUpFormQuery)
            .then((result: Formulaires | null) => {
                if (!active) return;
                setForm(result);
                setLoadError(!result);
            })
            .catch(() => active && setLoadError(true))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, []);

    const handleSubmit = async ({ submission }: FormSubmissionPayload) => {
        if (!form?._id) throw new Error("The sign-up form is unavailable.");
        if (paymentEnabled && (!isPaid || !transactionId)) {
            throw new Error("Membership payment must be completed before registration.");
        }

        const response = await fetch("/api/membership", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                formId: form._id,
                paymentIntentId: paymentEnabled ? transactionId : null,
                selectedDate: submission.selectedDate ?? null,
                answers: submission.answers?.map((answer) => ({
                    question: answer.question ?? "",
                    response: answer.response ?? "",
                })) ?? [],
            }),
        });

        if (!response.ok) {
            throw new Error("The membership registration could not be saved.");
        }
    };


    const handleFieldChange = (section: { label?: string }, value: unknown) => {
        if (section.label !== "Aimeriez-vous payer la cotisation de membre de 10 $ maintenant?") return;

        setPaymentEnabled(value === "Oui");
    };

    if (loading) return <p className="my-6 text-center">Chargement du formulaire d’inscription...</p>;

    if (loadError || !form?.sections) {
        return (
            <p role="alert" className="my-6 text-center">
                Le formulaire d’inscription est temporairement indisponible.
            </p>
        );
    }

    return (
        <div className="flex flex-col w-3/5 my-6 mx-auto bg-custom-beige p-10 rounded-2xl border-black border-4 overflow-hidden max-lg:w-11/12 max-sm:p-5">
            <Typography as="h1" className={typographyTheme({ size: "h1" })}>
                Bienvenue parmi nous!
            </Typography>
            <FormRenderer
                formTitle={form.formTitle}
                formDesc={form.formDesc}
                sections={form.sections}
                formRef={form._id}
                requireMember={false}
                onSubmit={handleSubmit}
                onFieldChange={handleFieldChange}
                beforeSubmit={paymentEnabled ? (
                    isPaid ? (
                        <p role="status">Paiement complété avec succès.</p>
                    ) : (
                        <PaymentForm setIsPaid={setIsPaid} setTransactionId={setTransactionId} />
                    )
                ) : null}
                submitDisabled={paymentEnabled && (!isPaid || !transactionId)}
                successMessage="Inscription complétée avec succès!"
                errorMessage="Une erreur est survenue lors de l’inscription."
            />
        </div>
    );
}
