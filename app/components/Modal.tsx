/* eslint-disable @next/next/no-img-element */
import { Card, Formulaires } from "@/sanity.types";
import SectionRenderer from "./SectionRenderer";
import sanityImgUrl from "../sanityImageBuilder";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import FormRenderer from "./FormRenderer";
import { useEffect } from "react";

type FormSections = NonNullable<Formulaires["sections"]>;

interface ModalProps extends Card {
    open: boolean;
    onClose: () => void;
    type: 'regular' | 'form';
    formContent?: FormSections;
    formRef?: string;
}

export default function Modal({ open, onClose, title, image, modalContent, formContent, type, formRef }: ModalProps) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'; 
        } else {
            document.body.style.overflow = ''; 
        }
        return () => {
            document.body.style.overflow = ''; 
        };
    }, [open]);

    return (
        <div className={`modal w-full h-full overflow-y-scroll fixed inset-0 z-50 ${open ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className="modal-overlay fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className={`modal-container w-full lg:w-4/5 relative bg-custom-beige max-w-6xl mx-auto my-20 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 ease-in-out ${open ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
                <div className="relative h-64 w-full overflow-hidden">
                    {image && <img src={sanityImgUrl(image).height(400).url()} alt={title} className="w-full filter blur-sm brightness-90" />}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Typography as={"h2"} className={`${typographyTheme({ size: "h2" })} text-white shadow-text-sm`}>{title}</Typography>
                    </div>
                </div>
                <div className="modal-content w-full *:!px-20 *:!items-start">
                    {type === "regular" && modalContent && <SectionRenderer section={modalContent} />}
                    {type === "form" && formContent && <FormRenderer sections={formContent} formRef={formRef} />}
                </div>
            </div>
        </div>
    );
}