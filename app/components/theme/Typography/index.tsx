import { tv } from "tailwind-variants"

const typographyTheme = tv({
    base: 'text-shadow-inherit',
    variants: {
        size: {
            h1: 'text-7xl',
            h2: 'text-5xl',
            h3: 'text-4xl',
            h4: 'text-3xl',
            h5: 'text-2xl',
            h6: 'text-xl',
            leading: 'text-base font-bold leading-normal',
            paragraph: 'text-xl inline',
            footnote: 'text-base',
            xs: 'text-xs'
        }
    }
})

export default typographyTheme