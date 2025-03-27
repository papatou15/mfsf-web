"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Formulaires } from "@/sanity.types";
import MFButton from "./MFButton";
import { MFButtonProps } from "./MFButton";
import { formFetcher } from "../queries"; // Adjust the import based on where you handle the query

interface FormModalButtonProps extends MFButtonProps {
    form: Formulaires | { _ref: string }; // Form can be either the full object or a reference
    formSections: NonNullable<Formulaires["sections"]>;
}

const FormModalButton: React.FC<FormModalButtonProps> = ({ form, title }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullForm, setFullForm] = useState<Formulaires | null>(null); // Store the full form content
    const [loading, setLoading] = useState(false);

    // Fetch the form content if it's a reference
    useEffect(() => {
        const fetchFormContent = async () => {
            if ("_ref" in form) {
                try {
                    setLoading(true);

                    const query = `*[_type == "formulaires" && _id == $formRef][0]{
                        _id,
                        formTitle,
                        sections[] {
                            ...
                        }
                    }`;
                    const result = await formFetcher(query, { formRef: form._ref });

                    setFullForm(result); // Set the fetched form content
                } catch (error) {
                    console.error("Error fetching form content:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setFullForm(form); // Use the passed form directly if it's already expanded
            }
        };

        fetchFormContent();
    }, [form]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <div>Loading form...</div>; // Show loading indicator while the form is being fetched
    }

    return (
        <>
            <MFButton _type="button" style="smallbg" onClick={handleOpenModal}>
                {title}
            </MFButton>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={fullForm?.formTitle || ""}
                image={undefined}
                type="form"
                formContent={fullForm?.sections || []}
                _type={"card"}
                formRef={fullForm?._id || ""}
            />
        </>
    );
};

export default FormModalButton;
