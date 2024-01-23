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
        background: "#FAFBF7",
        orange: "#FDA78F",
        red: "#EB2328",
        darkGrey: "#292524",
      },
      backgroundImage: {},
    },
  },
  plugins: [],
};
export default config;
