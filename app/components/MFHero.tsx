/* eslint-disable @next/next/no-img-element */
import { HeroSection, } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type MFHeroProps = HeroSection

const MFHero: React.FC<MFHeroProps> = ({ title, subTitle, image, layout, _type, bgColor }) => {

    return (
        <div className={`${_type} py-20 flex justify-center items-center`}>
            <div style={{ backgroundColor: bgColor?.hex ? bgColor?.hex : ''}} className={`py-12 px-32 rounded-[1.5rem] shadow-[0_55px_100px_-25px_rgba(0,0,0,0.25)] flex ${layout == 'default' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-center items-center`}>
                <div className="w-[50%] flex flex-col justify-center items-start">
                    <Typography as="h1" className={`${typographyTheme({ size: 'h1' })} py-4`}>
                        {title}
                    </Typography>
                    <Typography as="p" className={typographyTheme({ size: 'h4' })}>
                        {subTitle}
                    </Typography>
                </div>
                <div className="w-[50%] flex justify-center">
                    <img src={sanityImgUrl(image).width(900).url()} alt="" className="rounded-3xl border-black border-[3px]" />
                </div>
            </div>
        </div>

    )
}

export default MFHero