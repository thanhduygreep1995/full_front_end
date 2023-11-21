/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" 
  ],
  theme: {
    screens: {
      sm : '576px',
      md : '768px',
      lg : '992px',
      xl : '1200px',
      xxl : '1200px',
    },
    container : {
      center : true,
      padding : '1rem',
    },
    extend: {
      colors: {
        primary : '#FD3D57',
        
      },
      fontFamily: {
        'Poppins': ['Poppins'],
        'Roboto': ['Roboto'],
      }
    },
  },
  plugins: [
    require('flowbite/plugin') // add this line
  ],
}

