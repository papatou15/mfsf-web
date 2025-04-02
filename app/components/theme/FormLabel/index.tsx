import { tv } from "tailwind-variants";

const formLabelTheme = tv({
    base: 'ml-5 mt-12 mb-2',
    variants: {
        size: {
            small: 'text-2xl',
            medium: 'text-3xl',
            large: 'text-5xl',
        },
        margin: {
            small: 'ml-2 mt-2 mb-4',
            medium: 'ml-5 mt-12 mb-4',
            large: 'ml-10 mt-16 mb-6',
        }
    }
})

export default formLabelTheme