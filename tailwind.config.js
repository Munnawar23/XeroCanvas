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
        background: "#F5E6D3",
        card: "#FFF8E7",
        text: "#3E2723",
        subtext: "#8D6E63",
        accent: "#D4A574",
        border: "#E0C9A6",
        overlay: "rgba(62,39,35,0.05)",

        // Button colors
           button: {
          primary: "#000000",      
          secondary: "#D4A574",     
          disabled: "#B0A090",      
        },
        dark: {
          background: "#1A1612",
          card: "#2B2520",
          text: "#F4E4C1",
          subtext: "#C9B896",
          accent: "#FF6B35",
          border: "#3D342E",
          overlay: "rgba(244,228,193,0.04)",
          button: {
            primary: "#D4422E",     
            secondary: "#E8AA42",   
            disabled: "#5C4F47",    
          },
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