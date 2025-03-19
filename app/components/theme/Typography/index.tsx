import { tv } from "tailwind-variants"

const typographyTheme = tv({
    base: 'text-shadow-inherit',
    variants: {
        size: {
            h1: 'text-5xl sm:text-6xl md:text-7xl',
            h2: 'text-4xl sm:text-5xl md:text-6xl',
            h3: 'text-3xl sm:text-4xl md:text-5xl',
            h4: 'text-2xl sm:text-3xl md:text-4xl',
            h5: 'text-xl sm:text-2xl md:text-3xl',
            h6: 'text-lg sm:text-xl md:text-2xl',
            leading: 'text-sm sm:text-base font-bold leading-normal',
            paragraph: 'text-lg sm:text-xl inline',
            footnote: 'text-sm sm:text-base',
            xs: 'text-xs'
        }
    }
})


export default typographyTheme