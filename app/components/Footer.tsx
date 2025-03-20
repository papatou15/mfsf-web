/* eslint-disable @next/next/no-img-element */
"use client"

import { PageMaker, Contact } from "@/sanity.types";
import sanityImgUrl from "../sanityImageBuilder";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import typographyTheme from "./theme/Typography";
import Typography from "./Typography/Typography";
import { usePathname } from "next/navigation";

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
            <div className="footer flex flex-col lg:flex-row items-center justify-center px-20  bg-gradient-to-br lg:bg-gradient-to-l from-primary-blue to-[#0D5E68] lg:h-[400px] lg:rounded-2xl text-lg text-off-white ">
                <div className="lg:h-[70%] text-xl flex flex-col justify-center items-center">
                    <Typography as="h2" className={`${typographyTheme({size: "h5"})} shadow-text`}>Navigation</Typography>
                    {tabs ? tabs.map((tab) =>
                        <div key={tab._id} className={`${typographyTheme({ size: 'footnote' })} py-1 shadow-text-sm`}>
                            {tab.title}
                        </div>
                    ) : "no tabs"}
                </div>
                <div className="min-w-44 lg:min-w-64 lg:max-w-96 flex flex-col items-center justify-center mx-16">
                    <img className="bg-black bg-opacity-40 rounded-2xl py-8 px-2" src={sanityImgUrl(logo.footerLogo).url()} alt="Maison de la Famille de St-François" />
                    <Typography as="p" className={`${typographyTheme({size: 'footnote'})} shadow-text-sm mt-4`}>Maison de la famille de St-François © 2024</Typography>
                </div>
                <div className=" lg:h-[70%] flex flex-col justify-center items-center shadow-text-sm">
                    <div className="flex flex-col p-3 items-center">
                        <Typography as="h3" className={`${typographyTheme({size: 'h5'})} shadow-text py-3`}>Pour nous joindre</Typography>
                        <ul className={typographyTheme({ size: 'footnote' })}>
                            <li className="flex flex-row"><FaPhone className="mr-2" />Téléphone: {contacts.telephone}</li>
                            <li className="flex flex-row"><FaEnvelope className="mr-2" />{contacts.email}</li>
                            <li className="flex flex-row"><FaMapMarkerAlt className="mr-2" />{contacts.adress}</li>
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