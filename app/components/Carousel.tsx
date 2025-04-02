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
import MFLink from "./MFLink";
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
        <div className={`${_type} w-full mx-24 relative`}>
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
                    spaceBetween={20}
                    slidesPerView={1} // Default
                    autoplay={{ delay: 10000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2 }, // Extra small screens
                        860: { slidesPerView: 3 }, // Small screens
                        1300: { slidesPerView: 5 }, // Medium screens
                        1600: { slidesPerView: 7 }, // Large screens
                    }}
                    onSwiper={setSwiperInstance} // Store Swiper instance
                    className="carousel"
                >
                    {images?.map((image) => (
                        <SwiperSlide key={image?._key} >
                            <MFLink
                                link={image?.link ?? "#"}
                                style="smallcolorless"
                                extraCSS="h-40 w-40 overflow-hidden bg-white rounded-2xl flex items-center justify-center"
                                _type="button"
                            >
                                <img
                                    src={sanityImgUrl(image?.carouselImage).url()}
                                    alt="Carousel Image"
                                    className="object-fill w-full h-full rounded-2xl"
                                />
                            </MFLink>
                        </SwiperSlide>
                    ))}
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
