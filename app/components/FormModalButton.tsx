"use client"

import { useState } from "react";
import Modal from "./Modal";
import { Formulaires } from "@/sanity.types";
import MFButton from "./MFButton";
import { MFButtonProps } from "./MFButton";

interface FormModalButtonProps extends MFButtonProps {
    form: Formulaires;
    formSections: NonNullable<Formulaires["sections"]>;
}

const FormModalButton: React.FC<FormModalButtonProps> = ({ form, title }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <MFButton _type="button" style="smallbg" onClick={handleOpenModal}>
                {title}
            </MFButton>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={form.formTitle || ""}
                image={undefined}
                type="form"
                formContent={form.sections || []}
                _type={"card"}
            />
        </>
    );
};

export default FormModalButton;
