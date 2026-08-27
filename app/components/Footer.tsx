/* eslint-disable @next/next/no-img-element */
"use client"

import { PageMaker, Contact } from "@/sanity.types";
import sanityImgUrl from "../sanityImageBuilder";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import typographyTheme from "./theme/Typography";
import Typography from "./Typography/Typography";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
    tabs: PageMaker[];
    contacts: Contact;
    logo: Contact;
}

const Footer: React.FC<Props> = ({ tabs, contacts, logo }) => {

    const router = usePathname()
    const background = router === "/" ? "bg-custom-beige" : "bg-transparent"

    return (
        <div className={`footer-wrapper lg:p-9 ${background}`}>
            <div className="footer flex flex-col items-center justify-around gap-10 bg-gradient-to-br from-primary-blue to-[#0D5E68] px-4 py-10 text-lg text-off-white sm:px-8 lg:h-[400px] lg:flex-row lg:gap-6 lg:rounded-2xl lg:bg-gradient-to-l lg:px-12 lg:py-0">
                <div className="flex flex-col items-center justify-center text-xl lg:h-[70%]">
                    <Typography as="h2" className={`${typographyTheme({size: "h5"})} shadow-text`}>Navigation</Typography>
                    {tabs ? tabs.map((tab) =>
                        <div key={tab._id} className={`${typographyTheme({ size: 'paragraph' })} py-1 shadow-text-sm`}>
                            {tab.title}
                        </div>
                    ) : "no tabs"}
                </div>

                <div className="flex w-full max-w-xs flex-col items-center justify-center sm:max-w-sm lg:min-w-64 lg:max-w-96">
                    <img className="bg-black bg-opacity-40 rounded-2xl py-8 px-2" src={sanityImgUrl(logo.footerLogo).url()} alt="Maison de la Famille de St-François" />
                    <Typography as="p" className={`${typographyTheme({size: 'footnote'})} shadow-text-sm mt-4`}>Maison de la Famille de St-François © 2026</Typography>
                    <Link href="/confidentialite" className="mt-3 text-sm underline">Politique de confidentialité</Link>
                </div>

                <div className="flex max-w-full flex-col items-center justify-center shadow-text-sm lg:h-[70%]">
                    <div className="flex flex-col p-3 items-center">
                        <Typography as="h3" className={`${typographyTheme({size: 'h5'})} shadow-text py-3`}>Pour nous joindre</Typography>
                        <ul className={`${typographyTheme({ size: 'paragraph' })} max-w-full space-y-2`}>
                            <li className="flex min-w-0 flex-row items-start"><FaPhone className="mr-2 mt-1 shrink-0" /><span>Téléphone: {contacts.telephone}</span></li>
                            <li className="flex min-w-0 flex-row items-start"><FaEnvelope className="mr-2 mt-1 shrink-0" /><span className="break-all">{contacts.email}</span></li>
                            <li className="flex min-w-0 flex-row items-start"><FaMapMarkerAlt className="mr-2 mt-1 shrink-0" /><span>{contacts.adress}</span></li>
                        </ul>
                    </div>
                    <div className="flex flex-col p-3 items-center">
                        <Typography as="h3" className={`${typographyTheme({size: 'h5'})} shadow-text py-3`}>Liens utiles:</Typography>
                        <p>Prévention suicide: 988</p>
                        <p>Urgence: 911</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer
