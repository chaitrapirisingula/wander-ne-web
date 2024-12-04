/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Update with your file paths
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
      },
      colors: {
        blue: {
          DEFAULT: "#1E3A8A", // Custom Blue
        },
        yellow: {
          DEFAULT: "#F59E0B", // Custom Yellow
        },
      },
    },
  },
  plugins: [],
};
