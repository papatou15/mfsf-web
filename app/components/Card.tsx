/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { Card } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type MFCardProps = Card

const MFCard: React.FC<MFCardProps> = ({image, layout, subtitle, title}) => {
    return(
        <div className="flex flex-col h-[470px] w-[385px] rounded-xl border-black border-4 overflow-hidden transition-all hover:cursor-pointer hover:shadow-button hover:translate-x-1 hover:-translate-y-1">
            <div className="h-[45%]">
                <img src={sanityImgUrl(image).fit("fillmax").url()} alt=""/>
            </div>
            <div className="h-[55%] pt-8 px-6 bg-yellow-2 flex flex-col text-center items-center border-t-4 border-black">
                <Typography as="h3" className={typographyTheme({size: 'h3'})}>
                    {title}
                </Typography>
                {subtitle ? <Typography as="p" className={typographyTheme({size: 'paragraph'})}>
                    {subtitle}
                </Typography> : null}
            </div>
        </div>
    )
}

export default MFCard