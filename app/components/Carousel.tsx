/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Carousel as CarouselType } from "@/sanity.types";
import sanityImgUrl from "../sanityImageBuilder";
import MFLink from "./MFLink";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";

interface CarouselProps {
    images: CarouselType['images'];
    title: CarouselType['title'];
    imagesToShow: number;
}

const Carousel = ({ images, imagesToShow, title }: CarouselProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prevIndex) => images ? (prevIndex + imagesToShow) % images.length : 0);
    };

    const prev = () => {
        setCurrentIndex((prevIndex) => images ? (prevIndex - imagesToShow + images.length) % images.length : 0);
    };

    return (
        <div>
            {title && <Typography as="h2" className={`${typographyTheme({size: 'h4'})} text-center my-14`}>{title}</Typography>}
            <div className="carousel flex items-center space-x-4 overflow-hidden">
                <button onClick={prev} className="p-2 bg-primary rounded-full hover:bg-yellow-1">
                    <FaArrowLeft />
                </button>
                <div className="carousel-images flex space-x-4 overflow-x-auto">
                    {images?.map((image, index) => (
                        <MFLink link={image.link ?? '#'} key={image._key} styling={"smallcolorless"}>
                            <img key={index} src={sanityImgUrl(image.carouselImage).width(200).url()} alt={`Slide ${index}`} className="w-1/7 sm:w-1/2 object-cover" />
                        </MFLink>

                    ))}
                </div>
                <button onClick={next} className="p-2 bg-primary rounded-full hover:bg-gray-300">
                    <FaArrowRight />
                </button>
            </div>

        </div>
    );
};

export default Carousel;