import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      text: ['Nunito', 'sans-serif']
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': "#8800C8",
        'yellow-1': "#E2B41B",
        'yellow-2': "#FFC300",
        'accent-1': "#20453E",
        'off-white': "#f5f5f5",
        'custom-beige': "#f9efe3",
        'primary-blue': "#00AEC3",
        'primary-green': "#BBD143",
        'primary-red': "#EA5045",
        'primary-orange': "#F3943E",
      },
      boxShadow: {
        button: '-4px 4px 0 0 rgba(0,0,0,1)',
        box: '-15px 15px 0 0 rgba(0,0,0,1)',
        'big-box-bg': '0 55px 100px -25px rgba(0,0,0,0.25)',
      },
      textShadow: {
        xs: '-1px 1px rgba(0,0,0,0.25)',
        sm: '-2px 2px rgba(0,0,0,0.25)',
        DEFAULT: '-4px 4px rgba(0,0,0,0.25)',
        lg: '-6px 6px rgba(0,0,0,0.25)',
        inherit: 'inherit',
        none: 'none',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
};
export default config;
