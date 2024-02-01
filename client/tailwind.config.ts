import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px",
      },
      colors: {
        "dark-gray": "#949494",
        "light-gray": "#dbdada",
        "prm-green": "#52ab98",
        "prm-blue": "#2b6777",
        "prm-steel": "#c8d8e4",
        "prm-white": "#ffffff",
        "prm-gray": "#f2f2f2",
      },
    },
  },
  plugins: [],
} satisfies Config;
