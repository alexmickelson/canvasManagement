// import { borderRadius } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    borderRadius: {
      // ...borderRadius,
      xl: "24px",
    },
    extend: {},
  },
  plugins: [],
};
export default config;
