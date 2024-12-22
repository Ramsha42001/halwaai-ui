import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			poorStory: ['"Poor Story"', "sans-serif"],
			poppins: ['"Poppins"', "sans-serif"],
		  },
		  fontSize: {
			'xs': '0.75rem', // Extra Small
			'sm': '0.875rem', // Small
			'base': '1rem', // Base (Default)
			'lg': '1.125rem', // Large
			'xl': '1.25rem', // Extra Large
			'2xl': '1.5rem', // 2x Large
			'3xl': '1.875rem', // 3x Large
			'4xl': '2.25rem', // 4x Large
			'5xl': '3rem', // 5x Large
			'6xl': '3.75rem', // 6x Large
			'7xl': '4.5rem', // 7x Large
			'8xl': '6rem', // 8x Large
			'9xl': '8rem', // 9x Large
			'custom': '2.75rem', // Example Custom Font Size
		  },
  		colors: {
  			background: '#D74E26',
  			foreground: '',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#ffffff',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: '',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: '#FFEB3B',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
