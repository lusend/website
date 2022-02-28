module.exports = {
  important: '#app',
  content: [
    './src/pages/**/*.{html,js,md,njk}',
    './src/_includes/**/*.{html,js,md,njk,svg}',
    './src/_layouts/**/*.{html,js,md,njk}',
    './src/config/**/*.{html,js,md,njk}',
    './src/index.md',
    '!./src/_layouts/page.njk',
    '!./src/_layouts/brochure.njk'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#0A254E',
      'primary-focus': '#092145',
      'primary-content': '#ffffff',
      'primary-content-fade': '#c5c5c5',
      secondary: '#990000',
      'secondary-focus': '#8A0000',
      'secondary-content': '#ffffff',
      accent: '#9BC7EE',
      'accent-focus': '#79B4E8',
      'accent-content': '#ffffff',
      neutral: '#686A6F',
      'neutral-focus': '#5D5F63',
      'neutral-content': '#ffffff',
      'base-100': '#ffffff',
      'base-200': '#f9fafb',
      'base-300': '#d1d5db',
      'base-content': '#1f2937',
      info: '#2094f3',
      success: '#009485',
      warning: '#ff9900',
      error: '#ff5724',
      black: '#000000',
      white: '#ffffff'
    },
    screens: {
      xs: '410px',
      navXS: '500px',
      sm: '640px',
      md: '768px',
      navMD: '880px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      animation: {
        click: 'click 0.25s ease-out'
      },
      keyframes: {
        click: {
          '0%': { transform: 'scale(0.95)' },
          '40%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: [require('@tailwindcss/typography')]
};
