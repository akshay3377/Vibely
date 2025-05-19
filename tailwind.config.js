/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1350px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          // foreground: "hsl(var(--primary-foreground))",
        },
        ghost: {
          DEFAULT: "var(--ghost)",
          // foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
  plugins: [],
};
