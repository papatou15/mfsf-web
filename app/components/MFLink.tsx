import { ButtonProps } from "@headlessui/react";
import MFButton, { MFButtonProps } from "./MFButton";
import { tv } from "tailwind-variants";

export interface MFLinkProps{
    link: string | '#'
} 

const linkStyle = tv({
    base: 'w-auto flex justify-center items-center font-text'
})

const MFLink: React.FC<MFButtonProps & ButtonProps & MFLinkProps> = ({style, extraCSS, link, ...props}) => {
    return(
        <a href={link} className={`${props._type} ${linkStyle()} ${extraCSS}`}>
            <MFButton {...props} className={style}/>
        </a>
    )
}

export default MFLink