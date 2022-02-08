module.exports = {
  important: '#app',
  content: [
    './src/pages/**/*.{html,js,md,njk}',
    './src/_includes/**/*.{html,js,md,njk}',
    './src/_layouts/**/*.{html,js,md,njk}',
    './src/index.md',
    '!./src/_layouts/page.njk',
    '!./src/_layouts/brochure.njk'
  ],
  theme: {
    extend: {}
  },
  corePlugins: {
    preflight: false
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: '#0A254E',
          'primary-focus': '#092145',
          'primary-content': '#ffffff',
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
          error: '#ff5724'
        }
      }
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false
  }
};
