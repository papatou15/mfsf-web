/* eslint-disable @next/next/no-img-element */
import { TextOnPicture } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type TextOverImage = TextOnPicture

const MFTextOnPicture: React.FC<TextOnPicture> = ({ image, layout, text, title, _type, bgColor }) => {
    const imageFirst = layout !== "default";

    return (
        <section className={`${_type} w-full px-4 py-12 md:py-16`}>
            <div
                style={{backgroundColor: bgColor?.hex || '#F3943E'}}
                className="mx-auto grid w-full max-w-7xl items-center gap-8 overflow-hidden rounded-3xl p-6 shadow-big-box-bg md:p-10 lg:grid-cols-2 lg:gap-12"
            >
                <div className={`text-off-white ${imageFirst ? 'lg:order-2' : ''}`}>
                    <Typography as="h2" className={`${typographyTheme({ size: 'h2' })} !shadow-text`}>
                        {title}
                    </Typography>
                    <Typography as="p" className={`${typographyTheme({ size: "paragraph" })} mt-6 whitespace-pre-line shadow-text-sm`}>
                        {text}
                    </Typography>
                </div>
                <div className={`aspect-video w-full overflow-hidden rounded-2xl border-[3px] border-black ${imageFirst ? 'lg:order-1' : ''}`}>
                    <img
                        src={sanityImgUrl(image).width(1200).height(675).fit("crop").crop("focalpoint").auto("format").url()}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </section>
    )
}

export default MFTextOnPicture
