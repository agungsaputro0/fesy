import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        footerblue: "#f5f2ee",
        footeruplist: "#cec4ba",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'supernarrow': '330px',
        'mediumgap': '910px', 
        'largegap': '1150px',
      },
    },
  },
  plugins: [],
};
export default config;
