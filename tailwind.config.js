/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : "class",
  content: [
    "./app/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./components/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./utils/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./*.{html,js,jsx,ts,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}",
  ],
  presets: [require("nativewind/preset")],
  important: "html",
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1565C0" },
        danger: { DEFAULT: "#CC2200" },
        text: {
          secondary: "#007AFF",
          teritary: "#4A90A4",
          nuetral: "#f7f7f7",
        },
      },
      fontFamily: {
        heading: undefined,
        body: undefined,
        mono: undefined,
        jakarta: ["var(--font-plus-jakarta-sans)"],
        roboto: ["var(--font-roboto)"],
        code: ["var(--font-source-code-pro)"],
        inter: ["var(--font-inter)"],
        "space-mono": ["var(--font-space-mono)"],
      },
      fontWeight: {
        extrablack: "950",
      },
      fontSize: {
        "2xs": "10px",
      },
      boxShadow: {
        "hard-1": "-2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
        "hard-2": "0px 3px 10px 0px rgba(38, 38, 38, 0.20)",
        "hard-3": "2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
        "hard-4": "0px -3px 10px 0px rgba(38, 38, 38, 0.20)",
        "hard-5": "0px 2px 10px 0px rgba(38, 38, 38, 0.10)",
        "soft-1": "0px 0px 10px rgba(38, 38, 38, 0.1)",
        "soft-2": "0px 0px 20px rgba(38, 38, 38, 0.2)",
        "soft-3": "0px 0px 30px rgba(38, 38, 38, 0.1)",
        "soft-4": "0px 0px 40px rgba(38, 38, 38, 0.1)",
      },
    },
  },
};
