/* eslint-disable @next/next/no-img-element */
import { TextOnPicture } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type TextOverImage = TextOnPicture

const MFTextOnPicture: React.FC<TextOnPicture> = ({ image, layout, text, title, _type, bgColor }) => {
    return (
        <div className={`${_type} ${bgColor?.hex ? bgColor.hex : 'bg-transparent'} w-full`}>
            <div className={`w-[85vw] m-auto my-24 grid grid-cols-1 lg:flex ${layout ? "lg:flex-row" : "lg:flex-row-reverse"} bg-text-over-image-bg relative rounded-3xl shadow-[0_55px_100px_rgba(0,0,0,0.25)] overflow-hidden`} >
                <div className="w-full h-full lg:bg-gradient-to-r lg:from-primary-orange lg:via-[#EA893D] lg:via-[40%] absolute z-10"></div>
                <div className="w-full lg:w-[80%] col-[1_/_2] row-[1_/_2] lg:flex lg:flex-col lg:flex-1  text-off-white bg-gradient-to-t from-primary-orange via-[#EA893D] via-[40%] lg:bg-transparent lg:bg-none px-20 pt-36 pb-20 z-20">
                    <Typography as="h2" className={`py-20 ${typographyTheme({ size: 'h2' })} !text-shadow`}>
                        {title}
                    </Typography>
                    <Typography as="p" className={`${typographyTheme({ size: "paragraph" })} text-shadow-sm`}>
                        {text}
                    </Typography>
                </div>
                <div className="z-0 overflow-hidden col-[1_/_2] row-[1_/_2] lg:flex-shrink-0">
                    <img src={sanityImgUrl(image).width(1100).fit("crop").crop("center").url()} alt="" className="ml-auto"/>
                </div>
            </div>
        </div>
    )
}

export default MFTextOnPicture