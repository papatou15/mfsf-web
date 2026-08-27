/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */


"use client"

import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import sanityImgUrl from "../sanityImageBuilder";
import { TeamMember } from "@/sanity.types";
import { useState } from "react";
import { motion } from "framer-motion";

interface EmployeeCardProps {
    employee: NonNullable<TeamMember["employees"]>[number]; // Correct type for individual employees.
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleCardClick = () => {
        setIsClicked(!isClicked);
    };

    return (
        <motion.div
            className={`mt-8 flex w-full max-w-[800px] flex-col overflow-hidden rounded-2xl bg-primary-orange text-off-white shadow-big-box-bg shadow-text-sm hover:cursor-pointer sm:min-h-80 sm:flex-row sm:mt-12 ${isClicked ? "justify-center items-center" : ""}`}
            onClick={handleCardClick}
            whileHover={{
                scale: 0.95, // Shrinks the card slightly
                transition: { type: "spring", stiffness: 500, damping: 8 }, // Adds a bounce effect
            }}
            whileTap={{
                scale: 1, // Resets the scale when the mouse leaves
                transition: { type: "spring", stiffness: 300, damping: 10 },
            }}
        >
            {!isClicked ? (
                <>
                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-8">
                        <Typography as={"h5"} className={`my-4 ${typographyTheme({ size: 'h4' })}`}>
                            {employee.name}
                        </Typography>
                        <Typography as="p" className={` ${typographyTheme({ size: 'h6' })}`}>
                            {employee.role}
                        </Typography>
                        <div className="mt-8 flex flex-row items-center sm:mt-10">
                            <FaPhone className="mr-2 shrink-0" />
                            <Typography as="p" className={` ${typographyTheme({ size: 'paragraph' })}`}>
                                {employee.contacts?.phone}
                            </Typography>
                        </div>
                        <div className="flex min-w-0 flex-row items-center">
                            <FaEnvelope className="mr-2 shrink-0" />
                            <Typography as="p" className={`min-w-0 break-all ${typographyTheme({ size: 'paragraph' })}`}>
                                {employee.contacts?.email}
                            </Typography>
                        </div>
                    </div>
                    {/* // @ts-expect-error Ignore missing alt field */}
                    <img src={sanityImgUrl(employee.picture).crop("focalpoint").fit("crop").size(600, 450).auto("format").url()} alt={(employee.picture as any)?.asset?.altText || "Portrait du membre de l’équipe"} className="aspect-[4/3] w-full object-cover shadow-big-box-bg sm:ml-auto sm:h-auto sm:w-2/5" />
                </>
            ) : (
                <Typography as="p" className={`px-5 py-8 text-center sm:px-12 ${typographyTheme({ size: 'paragraph' })}`}>
                    {employee.description || "No description available."}
                </Typography>
            )}
        </motion.div>
    );
};
