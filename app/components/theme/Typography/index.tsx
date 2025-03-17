import { tv } from "tailwind-variants"

const typographyTheme = tv({
    variants: {
        size: {
            h1: 'text-7xl text-shadow-inherit',
            h2: 'text-5xl text-shadow-inherit',
            h3: 'text-4xl text-shadow-inherit',
            h4: 'text-3xl text-shadow-inherit',
            h5: 'text-2xl text-shadow-inherit',
            h6: 'text-xl text-shadow-inherit',
            leading: 'text-base font-bold leading-normal text-shadow-inherit',
            paragraph: 'text-xl inline text-shadow-inherit',
            footnote: 'text-base text-shadow-inherit',
            xs: 'text-xs text-shadow-inherit'
        }
    }
})

export default typographyTheme