import { Button as HeadlessButton, ButtonProps } from "@headlessui/react";
import React from "react";
import { tv } from 'tailwind-variants';
import { Button as SanityButton } from "@/sanity.types";

export interface MFButtonProps extends SanityButton {
    extraCSS?: string;
}

const buttonStyle = tv({
    base: 'w-auto flex justify-center items-center font-text',
    variants: {
        styling: {
            coloredbg: 'h-14 md:h-16 bg-yellow-1 hover:bg-yellow-2 m-5 p-8 rounded-2xl text-black border-2 border-black text-2xl hover:shadow-button transition-all duration-100 hover:translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 active:bg-accent-1',
            smallbg: 'h-6 bg-yellow-1 hover:bg-yellow-2 m-5 p-4 md:p-6 rounded-2xl text-black border-2 border-black text-lg hover:shadow-button transition-all duration-100 hover:translate-x-1 hover:-transltate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 active:bg-accent-1',
            colorless: 'h-14 md:h-16 bg-transparent m-5 p-8',
            smallcolorless: '',
        }
    }
});

const MFButton: React.FC<ButtonProps & MFButtonProps> = ({ style, extraCSS, type, title, children, ...props }) => {
    return (
        <HeadlessButton {...props} type={type} className={`${buttonStyle({ styling: `${style}` })} ${extraCSS ? extraCSS : ''}`}>
            {title || children}
        </HeadlessButton>
    );
};

export default MFButton;