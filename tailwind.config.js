/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.tsx",
    "./**/*.ts"
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          bg: "#0a0a0a",
          stone: "#3b3b3b",
          stoneLight: "#757575",
          stoneDark: "#1a1a1a",
          dirt: "#543d26",
          dirtDark: "#382818",
          grass: "#5b8731",
          grassSide: "#4a6b28",
          diamond: "#3c8527", 
          diamondLight: "#5b8731",
          accent: "#6a4c93",
          red: "#aa0000",
          gold: "#ffaa00",
          goldDark: "#cc8800",
        }
      },
      fontFamily: {
        pixel: ['"VT323"', 'monospace'],
        sans: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.8)',
        '3d': '8px 8px 0px 0px rgba(0,0,0,0.6)',
        '3d-hover': '12px 12px 0px 0px rgba(0,0,0,0.8)',
        '3d-sm': '4px 4px 0px 0px rgba(0,0,0,0.6)',
        'inner-3d': 'inset 4px 4px 0px 0px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'dirt-pattern': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqkAChmVBgYzq1asZGRgAq+cWbS41s68AAAAASUVORK5CYII=')",
      }
    },
  },
  plugins: [],
}
