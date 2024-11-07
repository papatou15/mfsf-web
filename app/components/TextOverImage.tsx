/* eslint-disable @next/next/no-img-element */
import { TextOnPicture } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type TextOverImage = TextOnPicture

const MFTextOnPicture: React.FC<TextOnPicture> = ({ image, layout, text, title }) => {
    return (
        <>
            <div className={`w-[85vw] m-auto my-24 grid grid-cols-1 lg:flex ${layout ? "lg:flex-row" : "lg:flex-row-reverse"} bg-text-over-image-bg relative rounded-3xl border-black border-4 shadow-box overflow-hidden`} >
                <div className="w-full h-full lg:bg-gradient-to-r lg:from-primary lg:via-[#A6298B] lg:via-[40%] absolute z-10"></div>
                <div className="w-full lg:w-[80%] col-[1_/_2] row-[1_/_2] lg:flex lg:flex-col lg:flex-1  text-off-white bg-gradient-to-t from-primary via-[#A6298B] via-[40%] lg:bg-transparent lg:bg-none px-20 pt-36 pb-20 z-20">
                    <Typography as="h2" className={`py-20 ${typographyTheme({ size: 'h2' })}`}>
                        {title}
                    </Typography>
                    <Typography as="p" className={typographyTheme({ size: "paragraph" })}>
                        {text}
                    </Typography>
                </div>
                <div className="z-0 overflow-hidden col-[1_/_2] row-[1_/_2] lg:flex-shrink-0">
                    <img src={sanityImgUrl(image).width(1100).fit("crop").crop("center").url()} alt="" className="ml-auto"/>
                </div>
            </div>
        </>
    )
}

export default MFTextOnPicture