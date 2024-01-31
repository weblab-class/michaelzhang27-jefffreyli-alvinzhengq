import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#1a1a22",
        dawn: "#22222a",
        twilight: "#26262e",
        white: "#FFFFFF",
        primary: "#74dafe",
        accent: "#FE8587",
        accent_hover: "#FE7274",
        grey_accent: "#5a5b60"
      },
      backgroundImage: {},
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#FF6699",
          secondary: "#ffffff",
          accent: "#5a5b60",
          neutral: "#ffffff",
        },
      },
    ],
  },
  plugins: [require("daisyui"),require('tailwind-scrollbar')],
};
export default config;
