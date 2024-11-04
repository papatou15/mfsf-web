/* eslint-disable @next/next/no-img-element */
import { Card } from "@/sanity.types";
import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import sanityImgUrl from "../sanityImageBuilder";

export type MFCardProps = Card

const MFCard: React.FC<MFCardProps> = ({_type, image, layout, subtitle, title}) => {
    return(
        <div className="flex flex-col">
            <div>
                <img src={sanityImgUrl(image).url()} alt=""/>
            </div>
        </div>
    )
}

export default MFCard