/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        card: "#FFFFFF",
        text: "#1E293B",
        subtext: "#64748B",
        accent: "#3B82F6",
        border: "#E5E7EB",
        overlay: "rgba(0,0,0,0.04)",
      },
      fontFamily: {
        heading: ["Poppins-Bold"],
        body: ["Urbanist-Regular"],
        medium: ["Urbanist-Medium"],
        accent: ["Manrope-SemiBold"],
      },
    },
  },
  plugins: [],
};