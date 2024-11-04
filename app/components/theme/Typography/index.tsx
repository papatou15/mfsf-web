import { tv } from "tailwind-variants"

const typographyTheme = tv({
    variants: {
        size: {
            h1: 'text-5xl',
            h2: 'text-4xl',
            h3: 'text-3xl',
            h4: 'text-2xl',
            h5: 'text-xl',
            h6: 'text-lg',
            leading: 'text-base font-bold leading-normal',
            paragraph: 'text-base inline',
            footnote: 'text-sm',
            xs: 'text-xs'
        }
    }
})

export default typographyTheme