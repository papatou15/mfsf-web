import { Button as HeadlessButton, ButtonProps } from "@headlessui/react";
import React from "react";
import { tv } from 'tailwind-variants';
import { Button as SanityButton } from "@/sanity.types";

export interface MFButtonProps extends SanityButton {
    extraCSS?: string;
}

export const buttonStyle = tv({
    base: 'w-auto flex justify-center items-center',
    variants: {
        styling: {
            coloredbg: 'h-14 md:h-16 bg-off-white hover:bg-primary-blue m-5 p-8 rounded-2xl text-black border-2 border-black text-2xl hover:shadow-button transition-all duration-100 hover:translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 active:bg-slate-500',
            smallbg: 'h-6 bg-off-white hover:bg-primary-blue m-5 p-4 md:p-6 rounded-2xl text-black border-2 border-black text-lg hover:shadow-button transition-all duration-100 hover:translate-x-1 hover:-transltate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 active:bg-slate-500',
            colorless: 'h-14 md:h-16 bg-transparent m-5 p-8',
            smallcolorless: '',
        }
    }
});

const MFButton: React.FC<ButtonProps & MFButtonProps> = ({ style, extraCSS, type, title, children, ...props }) => {
    return (
        <HeadlessButton {...props} type={type} className={`${type} ${buttonStyle({ styling: style })} ${extraCSS ? extraCSS : ''} shadow-text-inherit`}>
            {title || children}
        </HeadlessButton>
    );
};

export default MFButton;