
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom app colors
				hubspot: '#ff7a59',
				teal: {
					DEFAULT: '#0091ae',
					50: '#e6f7fa',
					100: '#cceff6',
					200: '#99dfed',
					300: '#66cfe4',
					400: '#33bfdb',
					500: '#0091ae',
					600: '#00748b',
					700: '#005768',
					800: '#003b46',
					900: '#001e23',
				},
				alert: {
					DEFAULT: '#ff5630',
					50: '#fff0ed',
					100: '#ffe1da',
					200: '#ffc3b5',
					300: '#ffa590',
					400: '#ff876b',
					500: '#ff5630',
					600: '#cc4526',
					700: '#99341d',
					800: '#662213',
					900: '#33110a',
				},
				success: {
					DEFAULT: '#36b37e',
					50: '#edf9f3',
					100: '#daf3e7',
					200: '#b5e7cf',
					300: '#90dbb7',
					400: '#6bcf9f',
					500: '#36b37e',
					600: '#2b8f65',
					700: '#206b4c',
					800: '#164832',
					900: '#0b2419',
				},
				warning: {
					DEFAULT: '#ffab00',
					50: '#fff8e6',
					100: '#fff1cc',
					200: '#ffe399',
					300: '#ffd566',
					400: '#ffc733',
					500: '#ffab00',
					600: '#cc8900',
					700: '#996700',
					800: '#664400',
					900: '#332200',
				},
				neutral: {
					DEFAULT: '#425a70',
					50: '#edf0f2',
					100: '#dae0e6',
					200: '#b5c2cd',
					300: '#90a3b3',
					400: '#6b859a',
					500: '#425a70',
					600: '#35485a',
					700: '#283643',
					800: '#1a242d',
					900: '#0d1216',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0.8 },
				},
				'fade-in': {
					'0%': { opacity: 0, transform: 'translateY(10px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fade-in 0.5s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
