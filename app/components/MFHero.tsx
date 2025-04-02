/* eslint-disable @next/next/no-img-element */
import { HeroSection, } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type MFHeroProps = HeroSection

const MFHero: React.FC<MFHeroProps> = ({ title, subTitle, image, layout, _type, bgColor }) => {

    return (
        <div className={`${_type} py-20 flex justify-center items-center`}>
            <div style={{ backgroundColor: bgColor?.hex ? bgColor?.hex : ''}} className={`py-12 md:px-32 sm:rounded-xl shadow-big-box-bg flex flex-col ${layout == 'default' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-center items-center`}>
                <div className="md:w-[50%] flex flex-col justify-center items-start">
                    <Typography as="h1" className={`${typographyTheme({ size: 'h1' })} !shadow-text py-4`}>
                        {title}
                    </Typography>
                    <Typography as="p" className={`${typographyTheme({ size: 'h4' })} !shadow-text-sm`}>
                        {subTitle}
                    </Typography>
                </div>
                <div className="md:w-[50%] flex justify-center">
                    <img src={sanityImgUrl(image).width(900).url()} alt="" className="my-4 md:my-0 border-y-[3px] md:rounded-3xl md:border-black md:border-[3px]" />
                </div>
            </div>
        </div>

    )
}

export default MFHero