"use client"

import typographyTheme from "../components/theme/Typography";
import Typography from "../components/Typography/Typography";
import Map from "../components/GoogleMap";
import FormContact from "../components/forms/FormContact";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { contactPageQuery, contactQuery, queryFetcher } from "../queries";
import type { Contact } from "@/sanity.types";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import SectionRenderer, { SectionProps } from "../components/SectionRenderer";

function ContactContent() {
    const searchParams = useSearchParams();
    const isCollaboration = searchParams.get("motif") === "collaboration";
    const markers = [
        { lat: 45.66297421713217, lng: -73.57978371107636 },
    ];

    const [contact, setContact] = useState<Contact | null>(null);
    const [sections, setSections] = useState<SectionProps[]>([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchContactInfo() {
            const [contactData, pageData]: [Contact, { sections?: SectionProps[] } | null] = await Promise.all([
                queryFetcher(contactQuery),
                queryFetcher(contactPageQuery),
            ]);
            setContact(contactData);
            setSections(pageData?.sections ?? []);
        }
        fetchContactInfo();
    }, []);

    return (
        <div className="flex flex-col my-12">
            <div>
                <Typography as="h1" className={`flex justify-center xl:justify-normal xl:ml-14 ${typographyTheme({ size: 'h3' })}`}>
                    Nous contacter
                </Typography>
            </div>
            <div className="flex flex-col justify-center items-start xl:flex-row">
                <div className="w-full xl:w-1/2 flex flex-col items-center justify-center px-10">
                    <div className="w-full max-w-[700px] flex flex-col bg-primary-green px-7 my-7 mx-auto rounded-3xl shadow-text-sm text-off-white shadow-big-box-bg">
                        <Typography as="h3" className={`${typographyTheme({ size: 'h5' })}`}>
                            Nous rejoindre
                        </Typography>
                        <div className="my-7">
                            <div className="my-2 flex items-center">
                                <FaPhone className="mr-2" />
                                <Typography as="span" className={typographyTheme({ size: 'paragraph' })}>{contact?.telephone}</Typography>
                            </div>
                            <div className="my-2 flex items-center">
                                <FaEnvelope className="mr-2" />
                                <Typography as="span" className={typographyTheme({ size: 'paragraph' })}>{contact?.email}</Typography>
                            </div>
                            <div className="my-2 flex items-center">
                                <FaMapMarkerAlt className="mr-2" />
                                <Typography as="span" className={typographyTheme({ size: 'paragraph' })}>{contact?.adress}</Typography>
                            </div>
                        </div>
                    </div>
                    <div className="map-wrapper px-10">
                        <Map apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} markers={markers} />
                    </div>
                </div>
                <div id="formulaire-contact" className="form-section-wrapper w-full scroll-mt-28 xl:w-1/2 xl:ml-auto px-10">
                    <div className="w-full flex flex-col bg-primary-orange px-7 my-7 rounded-3xl shadow-text-sm shadow-big-box-bg">
                        <div className="m-auto">
                            <Typography as="h3" className={`text-off-white ${typographyTheme({ size: 'h5' })}`}>
                                {success
                                    ? isCollaboration ? "Merci pour votre intérêt!" : "Merci de votre question!"
                                    : isCollaboration ? "Vous souhaitez collaborer avec nous?" : "Vous avez une question?"}
                            </Typography>
                        </div>
                        <FormContact success={success} setSuccess={setSuccess} mode={isCollaboration ? "collaboration" : "default"} />
                    </div>
                </div>

            </div>
            <div className="mx-10 xl:mx-14 mt-12">
                {sections.map((section) => (
                    <SectionRenderer key={section._key} section={section} {...section} />
                ))}
            </div>
        </div>
    )
}

export default function Contact() {
    return (
        <Suspense fallback={null}>
            <ContactContent />
        </Suspense>
    );
}
