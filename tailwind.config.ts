import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'body-lato': ['Lato', 'sans-serif'],
        'body-inter': ['Inter', 'sans-serif'],
        'display-inter': ['Inter', 'sans-serif'],
        'serif-source-serif-4': ['"Source Serif 4"', 'serif'],
        'body-source-serif-4': ['"Source Serif 4"', 'serif'],
        'body-poppins': ['Poppins', 'sans-serif'],
        'display-poppins': ['Poppins', 'sans-serif'],
        'headline-roboto-slab': ['"Roboto Slab"', 'serif'],
        'body-roboto': ['Roboto', 'sans-serif'],
        'display-jetbrains-mono': ['"JetBrains Mono"', 'monospace'],
        'body-helvetica': ['"Helvetica Neue"', 'sans-serif'],
        'display-libre-baskerville': ['"Libre Baskerville"', 'serif'],
        'body-open-sans': ['"Open Sans"', 'sans-serif'],
        'display-merriweather': ['Merriweather', 'serif'],
        'body-merriweather-sans': ['"Merriweather Sans"', 'sans-serif'],
        'body-mulish': ['Mulish', 'sans-serif'],
        'display-work-sans': ['"Work Sans"', 'sans-serif'],
        'body-work-sans': ['"Work Sans"', 'sans-serif'],
        'code-fira': ['"Fira Code"', 'monospace'],
        'display-montserrat': ['Montserrat', 'sans-serif'],
        'body-montserrat': ['Montserrat', 'sans-serif'],
        'body-nunito': ['Nunito', 'sans-serif'],
        'serif-eb-garamond': ['"EB Garamond"', 'serif'],
        'body-quicksand': ['Quicksand', 'sans-serif'],
        'body-karla': ['Karla', 'sans-serif'],
        'serif-playfair': ['"Playfair Display"', 'serif'],
        'body-lora': ['Lora', 'serif'],
        'display-raleway': ['Raleway', 'sans-serif'],
        'body-raleway': ['Raleway', 'sans-serif'],
        'display-ibm-plex-sans': ['"IBM Plex Sans"', 'sans-serif'],
        'body-ibm-plex-sans': ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
