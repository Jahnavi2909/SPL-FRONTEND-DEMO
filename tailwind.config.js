/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Bebas Neue", "sans-serif"],
        body: ["Barlow", "sans-serif"],
        condensed: ["Barlow Condensed", "sans-serif"],
      },
      fontSize: {
        "display-xs": ["2rem", { lineHeight: "1", letterSpacing: "0.04em" }],
        "display-sm": ["2.5rem", { lineHeight: "1", letterSpacing: "0.05em" }],
        "display-md": ["3rem", { lineHeight: "1", letterSpacing: "0.05em" }],
      },
    },
  },
  plugins: [],
};