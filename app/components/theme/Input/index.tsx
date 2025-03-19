import { tv } from "tailwind-variants";

const inputTheme = tv({
    base: "p-4 rounded-xl border-black border-2 focus-visible:border-none !text-black",
    variants: {
        lowPadding: {
            true: 'p-2 rounded-lg'
        },
        readOnly: {
            true: 'bg-slate-200 border-none'
        }
    }
})

export default inputTheme