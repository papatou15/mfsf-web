import type { Config } from "tailwindcss";


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
        'off-white': "#e5e5e5"
      },
      boxShadow: {
        button: '-4px 4px 0 0 rgba(0,0,0,1)'
      }
    },
  },
  plugins: [],
};
export default config;
