import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: { ash: "#FAFAFA" },
      fontFamily: {
        stacion: ["Stacion", "sans"],
      },
      fontSize: {
        custom: "20px",
      },
      letterSpacing: {
        tighter: "-0.02em",
      },
      lineHeight: {
        custom: "28px",
      },
    },
  },
  plugins: [],
};
export default config
