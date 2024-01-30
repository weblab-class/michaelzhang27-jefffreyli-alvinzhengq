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
        midnight: "#141414",
        dawn: "#1F1F1F",
        white: "#FFFFFF",
        primary: "#FF6699",
        accent: "#70AE6E"
      },
      backgroundImage: {},
    },
  },
  plugins: [],
};
export default config;
