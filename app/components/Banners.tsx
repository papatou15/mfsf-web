/* eslint-disable @next/next/no-img-element */
import { Banner as SanityBanner } from "@/sanity.types";
import MFLink from "./MFLink";
import sanityImgUrl from "../sanityImageBuilder";

interface BannerProps {
    banner: NonNullable<SanityBanner["bannerList"]>
}

const Banner = ({ banner = [] }: BannerProps) => {

    const shownBanner = banner[0] ?? null;

    return (
        <>
            {shownBanner.isActive && (
                <div
                    style={{ backgroundColor: shownBanner.bgColor?.hex }}
                    className={`w-full h-20 border-b-2 border-black flex items-center overflow-hidden relative`}
                >
                    {shownBanner.bannerBgImage ? (
                        <div className="absolute inset-0">
                            <img src={sanityImgUrl(shownBanner.bannerBgImage).url()} alt="banner image" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
                    )}
                    {shownBanner.link ? (
                        <MFLink className="w-full h-full z-10" _type={"button"} link={shownBanner.link}>
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white">{shownBanner.textContent}</span>
                            </div>
                        </MFLink>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center z-10">
                            <span className="text-white">{shownBanner.textContent}</span>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Banner;