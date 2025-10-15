/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", 
  content: [
    "./src/App.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#F9FAFB",
          card: "#FFFFFF",
          text: "#1E293B",
          subtext: "#64748B",
          accent: "#3B82F6",
          border: "#E5E7EB",
          overlay: "rgba(0,0,0,0.04)",
        },
        dark: {
          background: "#0F172A",
          card: "#1E293B",
          text: "#F8FAFC",
          subtext: "#94A3B8",
          accent: "#60A5FA",
          border: "#334155",
          overlay: "rgba(255,255,255,0.05)",
        },
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
