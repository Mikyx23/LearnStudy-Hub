/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.ejs",
    "./public/**/*.js",
    "./views/**/*.ejs",
    "./**/*.ejs", // Esto asegura que encuentre EJS en cualquier nivel
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}