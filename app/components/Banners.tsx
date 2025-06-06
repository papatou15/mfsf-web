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
                    className={`h-20 mx-7 rounded-xl flex items-center overflow-hidden relative`}
                >
                    {shownBanner.bannerBgImage ? (
                        <div className="absolute inset-0">
                            <img src={sanityImgUrl(shownBanner.bannerBgImage).url()} alt="banner image" className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(to left, ${shownBanner.bgColor?.hex}, 70%, transparent)` }}></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0" style={{ backgroundColor: shownBanner.bgColor?.hex }}></div>
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