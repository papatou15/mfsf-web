/* eslint-disable @next/next/no-img-element */
"use client"

import { Card } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";
import MFButton from "./MFButton";
import { HiChevronDown } from "react-icons/hi";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { resolveButtonLink } from "../queries";
import MFLink from "./MFLink";

export type MFCardProps = Card;

const MFCard: React.FC<MFCardProps> = ({ image, layout, subtitle, title, modalContent, _type, color, link }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [resolvedLink, setResolvedLink] = useState<string | null>(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (!link) return;

        let active = true;
        resolveButtonLink(link).then((resolved) => {
            if (active) setResolvedLink(resolved);
        });

        return () => {
            active = false;
        };
    }, [link]);

    if (layout === 'smallCard') {
        return (
            <>
                <div
                    style={{ borderColor: color?.hex ? color?.hex : '' }}
                    className={`${_type} ${layout} w-full m-auto grid grid-cols-1 border-4 relative rounded-3xl overflow-hidden`}
                >
                    <div
                        style={{ background: `linear-gradient(to right, ${color?.hex}, 80%, transparent)` }}
                        className="w-full h-full absolute z-10"
                    ></div>
                    <div className="row-start-1 col-start-1 flex flex-col justify-center pl-8 w-3/5 z-20 text-off-white">
                        <Typography as="h3" className={`${typographyTheme({ size: 'h4' })} shadow-text-sm`}>
                            {title}
                        </Typography>
                        <div>
                            <MFButton
                                _type="button"
                                style="smallbg"
                                extraCSS="my-4 mx-0 z-20"
                                onClick={handleOpenModal}
                            >
                                <Typography as="p" className="flex flex-row justify-center items-center">
                                    Voir plus
                                    <HiChevronDown />
                                </Typography>
                            </MFButton>
                        </div>
                    </div>
                    <div className="z-0 row-start-1 col-start-1">
                        <img src={sanityImgUrl(image).width(900).height(450).fit("crop").crop("focalpoint").auto("format").url()} alt="" className="w-full h-[200px] object-cover" />
                    </div>
                </div>
                <Modal
                    _type="card"
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    title={title}
                    modalContent={modalContent}
                    image={image}
                    type={"regular"}
                />
            </>
        );
    }

    return (
        <MFLink _type={"button"} link={(resolvedLink || link?.url || "")} target="_blank" extraCSS="w-full max-w-[385px]">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    borderColor: color?.hex ? color?.hex : '',
                    boxShadow: !isHovered
                        ? `${color?.hex} 0 15px, 0 0 100px rgba(0,0,0,0.25)`
                        : `${color?.hex} -15px 22px`,
                }}
                className={`${_type} my-4 flex h-full min-h-[420px] w-[calc(100vw_-_2rem)] max-w-[385px] flex-col overflow-hidden rounded-xl border-4 transition-all hover:cursor-pointer hover:translate-x-2 hover:-translate-y-2 2xl:my-0`}
            >
                <div className="z-10 shrink-0 bg-custom-beige px-4 pt-4 sm:px-6 sm:pt-6">
                    <img
                        src={sanityImgUrl(image).width(720).height(405).fit("crop").crop("focalpoint").auto("format").url()}
                        alt=""
                        className="w-full aspect-video object-cover rounded-xl border-black border-4"
                    />
                </div>
                <div className="flex flex-1 flex-col items-center bg-custom-beige px-5 pb-6 pt-4 text-center shadow-text-sm sm:px-6 sm:pt-5">
                    <Typography as="h3" className={typographyTheme({ size: 'h3' })}>
                        {title}
                    </Typography>
                    {subtitle ? (
                        <Typography as="p" className={typographyTheme({ size: 'paragraph' })}>
                            {subtitle}
                        </Typography>
                    ) : null}
                </div>
            </div>
        </MFLink>
    );
};

export default MFCard;
