"use client";

import { useEffect, useState } from "react";
import { Formulaires } from "@/sanity.types";

import type { ActivityPaymentContext } from "@/app/types/payments";
import { formFetcher } from "../queries";
import MFButton, { MFButtonProps } from "./MFButton";
import Modal from "./Modal";

interface FormModalButtonProps extends MFButtonProps {
    form: Formulaires | { _ref: string };
    formSections?: NonNullable<Formulaires["sections"]>;
    activite?: ActivityPaymentContext | { _ref: string };
}

const FormModalButton: React.FC<FormModalButtonProps> = ({ form, title, activite }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fetchedForm, setFetchedForm] = useState<Formulaires | null>(null);
    const [fetchedActivity, setFetchedActivity] = useState<ActivityPaymentContext | null>(null);

    const formIsReference = "_ref" in form;
    const activityIsReference = Boolean(activite && "_ref" in activite);
    const fullForm = formIsReference ? fetchedForm : form;
    const activity = activityIsReference ? fetchedActivity ?? undefined : activite as ActivityPaymentContext | undefined;

    useEffect(() => {
        if (!formIsReference) return;

        let active = true;
        const query = `*[_type == "formulaires" && _id == $formRef][0]{
            _id,
            formTitle,
            formDesc,
            sections[]{...}
        }`;

        formFetcher(query, { formRef: form._ref })
            .then((result: Formulaires | null) => {
                if (active) setFetchedForm(result);
            })
            .catch((error) => console.error("Impossible de charger le formulaire:", error));

        return () => {
            active = false;
        };
    }, [form, formIsReference]);

    useEffect(() => {
        if (!activite || !("_ref" in activite)) return;

        let active = true;
        const query = `*[_type == "activity" && _id == $activityRef][0]{
            _id,
            nom,
            produitStripe->{
                _id,
                nom,
                description,
                actif
            }
        }`;

        formFetcher(query, { activityRef: activite._ref })
            .then((result: ActivityPaymentContext | null) => {
                if (active) setFetchedActivity(result);
            })
            .catch((error) => console.error("Impossible de charger l’activité:", error));

        return () => {
            active = false;
        };
    }, [activite]);

    if ((formIsReference && !fullForm) || (activityIsReference && !activity)) {
        return <div>Chargement du formulaire...</div>;
    }

    return (
        <>
            <MFButton _type="button" style="smallbg" onClick={() => setIsModalOpen(true)}>
                {title}
            </MFButton>
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={fullForm?.formTitle || ""}
                image={undefined}
                type="form"
                formContent={fullForm?.sections || []}
                _type="card"
                formRef={fullForm?._id || ""}
                activite={activity}
            />
        </>
    );
};

export default FormModalButton;
