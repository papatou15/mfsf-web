/* eslint-disable @next/next/no-img-element */
import { Banner as SanityBanner } from "@/sanity.types";
import MFLink from "./MFLink";
import sanityImgUrl from "../sanityImageBuilder";

interface BannerProps {
    banner: NonNullable<SanityBanner["bannerList"]>
}

const Banner = ({ banner = [] }: BannerProps) => {

    const shownBanner = banner[0] ?? null

    return (
        <>
            {shownBanner.isActive &&
                <div
                    style={{ backgroundColor: shownBanner.bgColor?.hex }}
                    className={`w-full h-20 border-b-2 border-black flex items-center overflow-hidden`}
                >
                    <MFLink className="w-2/5 h-full object-contain " _type={"button"} link={shownBanner.link ?? ""}>
                        <div className="w-full h-full ">
                            <img src={sanityImgUrl(shownBanner.bannerBgImage).url()} alt="banner image" className="w-full h-full object-contain" />
                        </div>
                    </MFLink>
                </div>
            }
        </>
    )
}

export default Banner