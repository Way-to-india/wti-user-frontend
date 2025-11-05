import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/components/(date-picker|button|ripple|spinner|calendar|date-input|popover).js',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'carrot-orange': '#FF8B02',
        'milk-white': '#FFFFFF',
        'heavy-metal': '#262626',
      },
      fontFamily: {
        lexend: ['var(--font-lexend)', 'sans-serif'],
        limelight: ['var(--font-limelight)', 'cursive'],
      },
      backgroundImage: {
        bannerMosque: "url('/assets/images/mosque.svg')",
        blackOverlay: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0,0,0,0.8) 100%)',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        MobileScreen: { max: '480.5px' },
        TabletScreen: { min: '480.5px', max: '1024.5px' },
        DesktopScreen: { min: '1024.5px' },
      },
    },
  },
  plugins: [nextui(), require('tailwind-scrollbar')],
};
export default config;
