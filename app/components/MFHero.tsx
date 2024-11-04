import { HeroSection, } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import Image from "next/image";
import sanityImgUrl from "../sanityImageBuilder";

export type MFHeroProps = HeroSection

const MFHero: React.FC<MFHeroProps> = ({title, subTitle, image, layout}) => {

    return(
        <div className={`min-h-96 flex ${layout == 'default' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-center items-center`}>
            <div className="w-[50%] flex flex-col justify-center items-center">
                <Typography as="h1" className={typographyTheme({size: 'h1'})}>
                    {title}
                </Typography>
                <Typography as="h4" className={typographyTheme({size: 'h4'})}>
                    {subTitle}
                </Typography>
            </div>
            <div className="w-[50%] flex justify-center">
                <Image src={sanityImgUrl(image).url()} width={600} height={299} alt=""/>
            </div>
        </div>
    )
}

export default MFHero