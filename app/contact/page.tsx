"use client"

import typographyTheme from "../components/theme/Typography";
import Typography from "../components/Typography/Typography";
import Map from "../components/GoogleMap";
import FormContact from "../components/forms/FormContact";
import { useState, useEffect } from "react";
import { contactQuery, queryFetcher } from "../queries";
import type { Contact } from "@/sanity.types";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
    const markers = [
        { lat: 45.66297421713217, lng: -73.57978371107636 },
    ];

    const [contact, setContact] = useState<Contact | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchContactInfo() {
            const contactData: Contact = await queryFetcher(contactQuery);
            setContact(contactData);
        }
        fetchContactInfo();
    }, []); 

    return (
        <div className="flex flex-col mx-24 my-12">
            <div>
                <Typography as="h1" className={`mb-7 ${typographyTheme({ size: 'h3' })}`}>
                    Nous contacter
                </Typography>
            </div>
            <div className="flex flex-row">
                <div className="w-1/2">
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
                    <Map apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} markers={markers} />
                </div>
                <div className="w-1/2 flex flex-col">
                    <div className="m-auto">
                        <Typography as="h3" className={typographyTheme({size: 'h5'})}>{success ? "Merci de votre question!" : "Vous avez une question?"}</Typography>
                    </div>
                    <FormContact success={success} setSuccess={setSuccess}/>
                </div>
            </div>
        </div>
    )
}