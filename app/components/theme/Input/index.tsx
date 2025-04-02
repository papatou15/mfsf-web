import { tv } from "tailwind-variants";

const inputTheme = tv({
    base: "p-4 rounded-xl border-black bg-off-white border-2 !text-black",
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