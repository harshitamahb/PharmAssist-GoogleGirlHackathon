// tailwind.config.js
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-white': '#ffffff2b',
        'dark-grey': '#202123',
        'light-grey': '#353740',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          // Copy properties from DaisyUI's default light theme and override as needed
          'primary': '#570DF8',
          'secondary': '#F000B8',
          'accent': '#37CDBE',
          'neutral': '#cbd5e1',             // Your custom neutral color
          'neutral-content': '#475569',     // Your custom neutral-content color
          'base-100': '#FFFFFF',
          'base-content': '#1F2937',
          // Add other color properties as needed
        },
      },
      {
        dark: {
          // Copy properties from DaisyUI's default dark theme and override as needed
          'primary': '#661AE6',
          'secondary': '#D926AA',
          'accent': '#1FB2A6',
          'neutral': '#171c21',             // Your custom neutral color
          'neutral-content': '#94a3b8',     // Your custom neutral-content color
          'base-100': '#303030',            // Darker background
          'base-content': '#FFFFFF',
          // Add other color properties as needed
        },
      },
    ],
  },
  plugins: [daisyui],
};