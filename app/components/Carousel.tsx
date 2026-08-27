/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Carousel as CarouselType } from "@/sanity.types";
import sanityImgUrl from "../sanityImageBuilder";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import MFButton from "./MFButton";

interface CarouselProps extends CarouselType {
    images: CarouselType["images"];
    title: CarouselType["title"];
}

const Carousel = ({ images, title, _type }: CarouselProps) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

    return (
        <div className={`${_type} relative mx-auto w-full max-w-7xl px-14 sm:px-16`}>
            {title && (
                <Typography
                    as="h2"
                    className={`${typographyTheme({ size: "h4" })} text-center my-14`}
                >
                    {title}
                </Typography>
            )}

            <div className="relative flex items-center ">
                {/* Navigation Buttons */}
                <MFButton
                    _type="button"
                    style="smallbg"
                    onClick={() => swiperInstance?.slidePrev()} // Swiper instance method
                    className="absolute left-0 z-10"
                >
                    <FaArrowLeft />
                </MFButton>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1} // Default
                    autoplay={{ delay: 10000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2 }, // Extra small screens
                        860: { slidesPerView: 3 }, // Small screens
                        1100: { slidesPerView: 4 }, // Medium screens
                    }}
                    onSwiper={setSwiperInstance} // Store Swiper instance
                    className="carousel"
                >
                    {images?.map((image) => {
                        const imageWithAlt = image as typeof image & {alt?: string};
                        const logo = (
                            <div className="flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-1 sm:p-2">
                                <img
                                    src={sanityImgUrl(image?.carouselImage).auto("format").url()}
                                    alt={imageWithAlt.alt || "Logo d’un partenaire"}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        );

                        return (
                            <SwiperSlide key={image?._key}>
                                {image?.link ? (
                                    <a href={image.link} target="_blank" rel="noreferrer" aria-label={imageWithAlt.alt || "Visiter le site du partenaire"}>
                                        {logo}
                                    </a>
                                ) : logo}
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <MFButton
                    _type="button"
                    style="smallbg"
                    onClick={() => swiperInstance?.slideNext()} // Swiper instance method
                    className="absolute right-0 z-10"
                >
                    <FaArrowRight />
                </MFButton>
            </div>
        </div>
    );
};

export default Carousel;
