/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purana: {
          green: "#2F5D39",
          brown: "#533E23",
          red: "#C14C38",
          cream: "#EFE9C5",
          gold: "#DFC24D",
          white: "#FFFFFF",
          soft: "#F5F3EA",
        },
      },
    },
  },
  plugins: [],
};