/* eslint-disable @next/next/no-img-element */
import { HeroSection, } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type MFHeroProps = HeroSection

const MFHero: React.FC<MFHeroProps> = ({title, subTitle, image, layout}) => {

    return(
        <div className={`md:min-h-96 xl:min-h-[50rem] flex ${layout == 'default' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-center items-center`}>
            <div className="w-[50%] flex flex-col justify-center items-center">
                <Typography as="h1" className={typographyTheme({size: 'h1'})}>
                    {title}
                </Typography>
                <Typography as="h4" className={typographyTheme({size: 'h4'})}>
                    {subTitle}
                </Typography>
            </div>
            <div className="w-[50%] flex justify-center">
                <img src={sanityImgUrl(image).width(900).url()} alt="" className="rounded-3xl border-black border-[3px]"/>
            </div>
        </div>
    )
}

export default MFHero