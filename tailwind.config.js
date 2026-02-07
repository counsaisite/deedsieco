/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // System preference, no toggle
  theme: {
    extend: {
      colors: {
        deedsie: {
          navy: '#0f172a',
          charcoal: '#1e293b',
          blue: '#3b82f6',
          'blue-soft': '#60a5fa',
          'blue-deep': '#1e40af',
          accent: '#38bdf8',
        },
      },
    },
  },
  plugins: [],
};
