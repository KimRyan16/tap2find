/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.xian",
    "./layouts/**/*.xian",
    "./components/**/*.xian",
    "./public/**/*.html",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}