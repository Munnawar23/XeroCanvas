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
        // Light Theme
        background: "#F9FAFB",
        card: "#FFFFFF",
        text: "#1E293B",
        subtext: "#64748B",
        accent: "#3B82F6",
        border: "#E5E7EB",
        overlay: "rgba(0,0,0,0.04)",

        // Dark Theme
        dark: {
          background: "#111827", // A deep, dark blue-gray
          card: "#1F2937",      // A slightly lighter card background
          text: "#F1F5F9",      // A soft, off-white for text
          subtext: "#9CA3AF",    // A muted gray for secondary text
          accent: "#60A5FA",      // A brighter, more vivid accent for dark mode
          border: "#374151",      // A softer border color
          overlay: "rgba(255,255,255,0.04)", // A light overlay for contrast
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