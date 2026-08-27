/* eslint-disable @next/next/no-img-element */
import { HeroSection, } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type MFHeroProps = HeroSection

const MFHero: React.FC<MFHeroProps> = ({ title, subTitle, image, layout, _type, bgColor }) => {

    return (
        <div className={`${_type} flex items-center justify-center px-4 py-12 md:py-16`}>
            <div style={{ backgroundColor: bgColor?.hex ? bgColor?.hex : ''}} className={`flex w-full max-w-7xl flex-col items-center justify-center gap-8 rounded-3xl px-6 py-10 shadow-big-box-bg md:px-10 lg:px-14 ${layout == 'default' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex w-full flex-col items-start justify-center md:w-[42%]">
                    <Typography as="h1" className={`${typographyTheme({ size: 'h1' })} !shadow-text py-4`}>
                        {title}
                    </Typography>
                    <Typography as="p" className={`${typographyTheme({ size: 'h4' })} !shadow-text-sm`}>
                        {subTitle}
                    </Typography>
                </div>
                <div className="flex w-full justify-center md:w-[58%]">
                    <img
                        src={sanityImgUrl(image).width(1200).height(675).fit("crop").crop("focalpoint").auto("format").url()}
                        alt=""
                        className="aspect-video w-full max-w-2xl rounded-2xl border-[3px] border-black object-cover"
                    />
                </div>
            </div>
        </div>

    )
}

export default MFHero
