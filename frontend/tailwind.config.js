/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF7F50',
         'primaryhover': '#FF6347',
        'secondary': '#FFD700',
        'background': '#F8F9FA',
        'text': '#333333',
        'success': '#28A745', 
        'warning': '#DC3545',
        'border-shadow':'#E0E0E0'
      },
      fontFamily: {
        'poppins': ["inter", 'sans-serif'],
      },
      fontSize: {
        'heading':'32px',
        'subheading':'24px',
        'bodyText':'16px',
        'buttonText':'14px',
        'smallText':'12px',
        'tinyText':'10px'
      }
    },
  },
  plugins: [],
}

