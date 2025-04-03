/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import MFButton from "./MFButton";
import { motion } from "framer-motion";
import { PageMaker, Contact } from "@/sanity.types";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import MFLink from "./MFLink";
import sanityImgUrl from "../sanityImageBuilder";

interface Props {
    tabs: PageMaker[];
    logo?: Contact;
}

const Header: React.FC<Props> = ({ tabs, logo }) => {
    const { isSignedIn } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="header-wrapper lg:w-full sticky top-4 z-50 items-center justify-center">
            <div className="header my-4 lg:m-4 w-full h-full bg-gradient-to-l from-primary-blue to-[#0D5E68] flex flex-row items-center rounded-2xl shadow-[0_55px_50px_-25px_rgba(0,0,0,0.25)]">
                <div className="pl-6 py-2 min-w-20">
                    <img 
                        src={sanityImgUrl(logo?.headerLogo).height(75).fit("clip").url()} 
                        alt="Maison de la Famille de St-François" 
                    />
                </div>

                <div className="hidden lg:flex flex-row flex-wrap w-fit justify-center">
                    {tabs?.map((tab) => (
                        <MFLink 
                            link={`/${tab.slug?.current == "accueil" ? "" : tab.slug?.current}`} 
                            style="smallcolorless" 
                            key={tab._id} 
                            extraCSS="h-auto mx-10 md:mx-12 text-off-white text-xl shadow-text-sm" 
                            _type="button"
                        >
                            {tab.title || "No Title"}
                        </MFLink>
                    ))}
                </div>

                <div className="hidden lg:flex items-center flex-row ml-auto">
                    {!isSignedIn ? (
                        <SignInButton mode="modal">
                            <MFButton style="smallbg" _type="button">Connexion</MFButton>
                        </SignInButton>
                    ) : (
                        <>
                            <UserButton
                                showName={true}
                                appearance={{
                                    elements: {
                                        userButtonBox: 'h-6 bg-off-white hover:bg-primary-blue m-5 p-4 md:p-6 rounded-2xl text-black border-2 border-black hover:shadow-button transition-all duration-100 hover:translate-x-1 hover:-transltate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 active:bg-accent-1',
                                        userButtonPopoverMain: 'border-2 border-black rounded-2xl text-black',
                                        userButtonPopoverActionButton: 'text-black',
                                    }
                                }}
                            />
                            <MFLink _type="button" link="/account" style="smallbg">Portail de membre</MFLink>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="lg:hidden ml-auto mr-6" onClick={() => setMenuOpen(!menuOpen)}>
                    <div
                        className="relative w-8 h-8 flex items-center justify-center"
                    >
                        <motion.div
                            animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                            className="absolute w-6 h-0.5 bg-white"
                        />
                        <motion.div
                            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="absolute w-6 h-0.5 my-1 bg-white"
                        />
                        <motion.div
                            animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                            className="absolute w-6 h-0.5 bg-white"
                        />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <motion.div 
                initial={{ height: 0 }}
                animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`overflow-hidden lg:hidden absolute left-0 w-full bg-gradient-to-l from-primary-blue to-[#0D5E68] p-4 rounded-2xl shadow-lg z-40`}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: menuOpen ? 1 : 0 }}
                    transition={{ delay: 0.2, duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col items-center space-y-4"
                >
                    {tabs?.map((tab, index) => (
                        <motion.div
                            key={tab._id}
                            initial={{ y: -20  }}
                            animate={menuOpen ? { y: 0 } : { y: -20  }}
                            transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut", type: "spring", stiffness: 300 }}
                        >
                            <MFLink 
                                link={`/${tab.slug?.current == "accueil" ? "" : tab.slug?.current}`} 
                                style="smallcolorless" 
                                extraCSS="text-off-white text-lg" 
                                _type="button"
                                onClick={() => setMenuOpen(false)}
                            >
                                {tab.title || "No Title"}
                            </MFLink>
                        </motion.div>
                    ))}
                    <div className="flex flex-col items-center space-y-4">
                        {!isSignedIn ? (
                            <SignInButton mode="modal">
                                <MFButton style="smallbg" _type="button">Connexion</MFButton>
                            </SignInButton>
                        ) : (
                            <>
                                <UserButton
                                    showName={true}
                                    appearance={{
                                        elements: {
                                            userButtonBox: 'h-6 bg-off-white hover:bg-primary-blue p-4 rounded-2xl text-black border-2 border-black',
                                            userButtonPopoverMain: 'border-2 border-black rounded-2xl text-black',
                                            userButtonPopoverActionButton: 'text-black',
                                        }
                                    }}
                                />
                                <MFLink _type="button" link="/account" style="smallbg">Portail de membre</MFLink>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Header;