'use client'

import { useRouter } from 'next/navigation'
import { usePageTransition } from './PageTransition'
import { ButtonProps } from '@headlessui/react'
import MFButton, { MFButtonProps } from './MFButton'
import { tv } from 'tailwind-variants'
import { MouseEvent } from 'react'

export interface MFLinkProps extends MFButtonProps {
    link: string | '#',
    target?: string,
    rel?: string,
}

const linkStyle = tv({
    base: 'w-auto flex justify-center items-center'
})

const MFLink: React.FC<MFButtonProps & ButtonProps & MFLinkProps> = ({
    style,
    extraCSS,
    link,
    ...props
}) => {
    const router = useRouter()
    const { startTransition } = usePageTransition()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!link || link === '#') return

        e.preventDefault()
        startTransition()

        setTimeout(() => {
            router.push(link)
        }, 100) // let the animation start before route push
    }

    return (
        <a
            href={link}
            onClick={handleClick}
            className={`${props._type} ${linkStyle()} ${extraCSS}`}
        >
            <MFButton {...props} style={style} />
        </a>
    )
}

export default MFLink
