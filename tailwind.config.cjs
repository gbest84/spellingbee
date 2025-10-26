/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f8ff",
          100: "#d6ecff",
          200: "#add9ff",
          300: "#7cc2ff",
          400: "#4aa7ff",
          500: "#1c8bff",
          600: "#0a6fde",
          700: "#045ab1",
          800: "#034a8d",
          900: "#02366a"
        },
        sunshine: "#ffce45",
        coral: "#ff8a6d",
        mint: "#6fe7c0",
        lilac: "#b9a9ff"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        playful: ["Fredoka", "Poppins", "cursive"]
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem"
      },
      boxShadow: {
        bubble: "0 15px 30px -12px rgba(28, 139, 255, 0.25)",
        card: "0 20px 40px -24px rgba(15, 23, 42, 0.35)"
      },
      backgroundImage: {
        "playful-gradient": "linear-gradient(135deg, #f0f8ff 0%, #fff7ed 40%, #f3e8ff 100%)"
      }
    }
  },
  plugins: []
};
