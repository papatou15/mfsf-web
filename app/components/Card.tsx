/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import { Card } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";
import MFButton from "./MFButton";
import { HiChevronDown } from "react-icons/hi";
import { useState } from "react";
import Modal from "./Modal";

export type MFCardProps = Card

const MFCard: React.FC<MFCardProps> = ({image, layout, subtitle, title, modalContent, _type}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (layout === 'smallCard') {
        return (
            <>
                <div className={`${_type} ${layout} w-full m-auto grid grid-cols-1 relative rounded-3xl border-black border-4 overflow-hidden`} >
                    <div className="w-full h-full bg-gradient-to-r from-primary via-[#A6298B] via-[40%] absolute z-10"></div>
                    <div className="row-start-1 col-start-1 flex flex-col justify-center pl-8 w-3/5 z-20 text-off-white">
                        <Typography as="h3" className={`${typographyTheme({ size: 'h5' })}`}>
                            {title}
                        </Typography>
                        <div>
                            <MFButton _type="button" style="smallbg" extraCSS="my-4 mx-0 z-20" onClick={handleOpenModal}>
                                <>Vois plus<HiChevronDown/></>
                            </MFButton>
                        </div>
                    </div>
                    <div className="z-0 row-start-1 col-start-1">
                        <img src={sanityImgUrl(image).url()} alt="" className="w-full h-[200px] object-cover"/>
                    </div>
                </div>
                <Modal _type="card" open={isModalOpen} onClose={handleCloseModal} title={title} modalContent={modalContent} image={image} />
            </>
        );
    }

    return(
        <div className={`${_type} flex flex-col h-[470px] w-[385px] rounded-xl border-black border-4 overflow-hidden transition-all hover:cursor-pointer hover:shadow-button hover:translate-x-1 hover:-translate-y-1`}>
            <div className="h-[45%]">
                <img src={sanityImgUrl(image).fit("fillmax").url()} alt=""/>
            </div>
            <div className="h-[55%] pt-8 px-6 bg-yellow-2 flex flex-col text-center items-center border-t-4 border-black">
                <Typography as="h3" className={typographyTheme({size: 'h3'})}>
                    {title}
                </Typography>
                {subtitle ? <Typography as="p" className={typographyTheme({size: 'paragraph'})}>
                    {subtitle}
                </Typography> : null}
            </div>
        </div>
    )
}

export default MFCard