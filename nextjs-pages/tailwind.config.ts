import type { Config } from "tailwindcss";
import { borderRadius } from "tailwindcss/defaultTheme";


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      ...borderRadius,
      xl: "24px",
    },
    extend: {
    },
  },
  plugins: [],
};
export default config;
