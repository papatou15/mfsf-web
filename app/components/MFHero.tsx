import { HeroSection, } from "@/sanity.types";
import Typography from "./Typography/Typography";

export type MFHeroProps = HeroSection

const MFHero: React.FC<MFHeroProps> = ({title, subTitle, image, layout}) => {
    return(
        <div className={`flex ${layout == 'default' ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-[50%] flex flex-col justify-center items-center">
                <Typography as="h1" tokens="{}">
                    {title}
                </Typography>
                <Typography as="h4">
                    {subTitle}
                </Typography>
            </div>
            <div className="w-[50%]">
                
            </div>
        </div>
    )
}

export default MFHero