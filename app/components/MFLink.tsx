import { ButtonProps } from "@headlessui/react";
import MFButton, { MFButtonProps } from "./MFButton";
import { tv } from "tailwind-variants";

export interface MFLinkProps{
    link: string | '#'
} 

const linkStyle = tv({
    base: 'w-auto flex justify-center items-center font-text'
})

const MFLink: React.FC<MFButtonProps & ButtonProps & MFLinkProps> = ({styling, extraCSS, link, ...props}) => {
    return(
        <a href={link} className={`${linkStyle()} ${extraCSS}`}>
            <MFButton {...props} styling={styling}/>
        </a>
    )
}

export default MFLink