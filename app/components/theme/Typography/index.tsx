import { tv } from "tailwind-variants"

const typographyTheme = tv({
    variants: {
        size: {
            h1: 'text-8xl',
            h2: 'text-7xl',
            h3: 'text-6xl',
            h4: 'text-5xl',
            h5: 'text-4xl',
            h6: 'text-3xl',
            leading: 'text-base font-bold leading-normal',
            paragraph: 'text-xl inline',
            footnote: 'text-base',
            xs: 'text-xs'
        }
    }
})

export default typographyTheme