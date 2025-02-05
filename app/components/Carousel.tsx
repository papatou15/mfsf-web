/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Carousel as CarouselType } from "@/sanity.types";
import sanityImgUrl from "../sanityImageBuilder";
import MFLink from "./MFLink";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";

interface CarouselProps {
    images: CarouselType['images'];
    title: CarouselType['title'];
}

const Carousel = ({ images, title }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxImagesToShow = 7;
    const imageAmount = images.length ?? 0;

    const next = () => {
        setCurrentIndex((prevIndex) => images ? (prevIndex + 1) % images.length : 0);
    };

    const prev = () => {
        setCurrentIndex((prevIndex) => images ? (prevIndex - 1 + images.length) % images.length : 0);
    };

    useEffect(() => {
        const interval = setInterval(next, 10000); // Cycle every 10 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [images]);

    const displayedImages = [];
    for (let i = 0; i < maxImagesToShow; i++) {
        displayedImages.push(images[(currentIndex + i) % images.length]);
    }

    return (
        <div className="w-full px-24">
            {title && <Typography as="h2" className={`${typographyTheme({ size: 'h4' })} text-center my-14`}>{title}</Typography>}
            <div className="carousel flex items-center space-x-4 overflow-hidden">
                <button onClick={prev} className="p-4 bg-off-white rounded-xl border-black border-2 hover:bg-yellow-1 transition-all duration-200 ease-in-out">
                    <FaArrowLeft />
                </button>
                <div className="carousel-images-wrapper overflow-hidden relative w-full">
                    <div className="carousel-images flex transition-transform duration-500 ease-in-out">
                        {displayedImages.map((image, index) => (
                            <MFLink link={image.link ?? '#'} key={image._key} styling={"smallcolorless"} extraCSS="h-40 w-40 mx-2 overflow-hidden border-black rounded-2xl border-2">
                                <img key={index} src={sanityImgUrl(image.carouselImage).url()} alt={`Slide ${index}`} className="object-contain" />
                            </MFLink>
                        ))}
                    </div>
                </div>
                <button onClick={next} className="p-4 bg-off-white rounded-xl border-black border-2 hover:bg-yellow-1 transition-all duration-200 ease-in-out">
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default Carousel;