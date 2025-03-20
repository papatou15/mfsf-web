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

const MFCard: React.FC<MFCardProps> = ({image, layout, subtitle, title, modalContent, _type, color}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (layout === 'smallCard') {
        return (
            <>
                <div style={{ borderColor: color?.hex ? color?.hex : ''}} className={`${_type} ${layout} w-full m-auto grid grid-cols-1 border-4 relative rounded-3xl overflow-hidden`} >
                    <div style={{ background: `linear-gradient(to right, ${color?.hex}, 80%, transparent)`}} className="w-full h-full absolute z-10"></div>
                    <div className="row-start-1 col-start-1 flex flex-col justify-center pl-8 w-3/5 z-20 text-off-white">
                        <Typography as="h3" className={`${typographyTheme({ size: 'h4' })} shadow-text-sm`}>
                            {title}
                        </Typography>
                        <div>
                            <MFButton _type="button" style="smallbg" extraCSS="my-4 mx-0 z-20" onClick={handleOpenModal}>
                                <Typography as="p" className="flex flex-row justify-center items-center">Voir plus<HiChevronDown/></Typography>
                            </MFButton>
                        </div>
                    </div>
                    <div className="z-0 row-start-1 col-start-1">
                        <img src={sanityImgUrl(image).url()} alt="" className="w-full h-[200px] object-cover"/>
                    </div>
                </div>
                <Modal _type="card" open={isModalOpen} onClose={handleCloseModal} title={title} modalContent={modalContent} image={image} type={"regular"} formContent={[]} />
            </>
        );
    }

    return(
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ borderColor: color?.hex ? color?.hex : '', boxShadow: !isHovered ? `${color?.hex} 0 15px, 0 0 100px rgba(0,0,0,0.25)` : `${color?.hex} -15px 22px` }} 
            className={`${_type} flex flex-col h-[470px] w-[385px] my-5 2xl:my-0 rounded-xl border-4 overflow-hidden transition-all hover:cursor-pointer hover:translate-x-2 hover:-translate-y-2`}
        >
            <div className=" pt-7 px-7 z-10 bg-custom-beige">
                <img src={sanityImgUrl(image).fit("fillmax").url()} alt="" className="rounded-xl border-black border-4"/>
            </div>
            <div className="h-full pt-8 px-6 bg-custom-beige flex flex-col text-center items-center">
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