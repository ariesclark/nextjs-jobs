module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans Pro", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
