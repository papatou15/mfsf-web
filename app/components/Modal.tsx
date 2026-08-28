/* eslint-disable @next/next/no-img-element */
import { Card, Formulaires } from "@/sanity.types";
import { useEffect, type ReactNode } from "react";

import type { ActivityPaymentContext } from "@/app/types/payments";
import FormRenderer from "./FormRenderer";
import sanityImgUrl from "../sanityImageBuilder";
import SectionRenderer from "./SectionRenderer";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";

type FormSections = NonNullable<Formulaires["sections"]>;

interface ModalProps extends Card {
    open: boolean;
    onClose: () => void;
    type: 'regular' | 'form';
    formContent?: FormSections;
    formRef?: string;
    activite?: ActivityPaymentContext;
    children?: ReactNode;
}

export default function Modal({ open, onClose, title, image, modalContent, formContent, type, formRef, activite, children }: ModalProps) {
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (open) document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [open, onClose]);

    return (
        <div
            aria-hidden={!open}
            aria-modal="true"
            role="dialog"
            className={`modal w-full h-full overflow-y-scroll fixed inset-0 z-50 ${open ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
            <div className="modal-overlay fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className={`modal-container relative mx-auto my-4 w-[calc(100%_-_2rem)] max-w-6xl overflow-hidden rounded-lg bg-custom-beige shadow-lg transition-transform duration-300 ease-in-out sm:my-10 lg:my-20 lg:w-4/5 ${open ? 'translate-y-0' : 'translate-y-full'}`} onClick={(event) => event.stopPropagation()}>
                <button
                    type="button"
                    aria-label="Fermer la fenêtre"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-black/65 text-3xl leading-none text-white shadow-md transition hover:scale-105 hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-blue sm:right-5 sm:top-5"
                >
                    <span aria-hidden="true">×</span>
                </button>
                <div className="relative h-48 w-full overflow-hidden sm:h-64">
                    {image && <img src={sanityImgUrl(image).height(400).url()} alt={title} className="h-full w-full object-cover filter blur-sm brightness-90" />}
                    <div className="absolute inset-0 flex items-center justify-center px-4">
                        <Typography as="h2" className={`${typographyTheme({ size: "h2" })} text-center text-white shadow-text-sm`}>{title}</Typography>
                    </div>
                </div>
                <div className="modal-content w-full [&>*]:!items-start [&>*]:!px-4 sm:[&>*]:!px-10 lg:[&>*]:!px-20">
                    {type === "regular" && modalContent && <SectionRenderer section={modalContent} />}
                    {type === "form" && formContent && (
                        <FormRenderer sections={formContent} formRef={formRef} activite={activite} />
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
