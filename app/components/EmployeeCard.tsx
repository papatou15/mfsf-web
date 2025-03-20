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
            className={`w-[800px] sm:h-80 flex flex-col sm:flex-row mt-12 bg-primary-orange rounded-2xl shadow-big-box-bg mx-4 overflow-hidden shadow-text-sm text-off-white hover:cursor-pointer ${isClicked ? "justify-center items-center" : ""}`}
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
                    <div className="flex flex-col p-8 h-full">
                        <Typography as={"h5"} className={`my-4 ${typographyTheme({ size: 'h4' })}`}>
                            {employee.name}
                        </Typography>
                        <Typography as="p" className={` ${typographyTheme({ size: 'h6' })}`}>
                            {employee.role}
                        </Typography>
                        <div className="flex flex-row items-center mt-10">
                            <FaPhone className="mr-2" />
                            <Typography as="p" className={` ${typographyTheme({ size: 'paragraph' })}`}>
                                {employee.contacts?.phone}
                            </Typography>
                        </div>
                        <div className="flex flex-row items-center">
                            <FaEnvelope className="mr-2" />
                            <Typography as="p" className={` ${typographyTheme({ size: 'paragraph' })}`}>
                                {employee.contacts?.email}
                            </Typography>
                        </div>
                    </div>
                    <img src={sanityImgUrl(employee.picture).crop("focalpoint").fit("crop").size(200, 225).auto("format").url()} alt={employee.picture?.asset?.altText || "Alt text"} className="sm:w-2/5 sm:ml-auto h-full shadow-big-box-bg" />
                </>
            ) : (
                <Typography as="p" className={`text-center px-12 ${typographyTheme({ size: 'paragraph' })}`}>
                    {employee.description || "No description available."}
                </Typography>
            )}
        </motion.div>
    );
};