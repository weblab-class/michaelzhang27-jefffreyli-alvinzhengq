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
        darkerBackground: "#eaede6",
        orange: "#FDA78F",
        // orange: "#FFCBA4",
        honeydew: "#d0e1d4",
        blush: "#d34f73",
        red: "#EB2328",
        accent: "#94432a",
        darkGrey: "#292524",
      },
      backgroundImage: {},
    },
  },
  plugins: [],
};
export default config;
