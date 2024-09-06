const c = require('./src/configs/gruvbox_colors.js');
const defaultTheme = require('tailwindcss/defaultTheme');

const hexToRgb = (hex) => {
	hex = hex.replace('#', '');
	hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex;
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return `${r} ${g} ${b}`;
};

/** @type {import('tailwindcss').Config} */
const config = {
	// darkMode: ["class"],
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			sans: ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
			mono: ['"Noto Sans Mono"', ...defaultTheme.fontFamily.mono]
		},
		extend: {
			screens: {
				xs: '375px'
			},
			typography: {
				gruvbox: {
					css: {
						maxWidth: '80ch',
						'--tw-prose-body': c.gruvfg,
						'--tw-prose-headings': c.gruvfg,
						'--tw-prose-lead': c.gruvfg,
						'--tw-prose-links': c.gruvfg,
						'--tw-prose-bold': c.gruvfg,
						'--tw-prose-counters': c.gruvfg,
						'--tw-prose-bullets': c.gruvfg,
						'--tw-prose-hr': c.gruvfg,
						'--tw-prose-quotes': c.gruvfg,
						'--tw-prose-quote-borders': c.gruvfg,
						'--tw-prose-captions': c.gruvfg,
						'--tw-prose-code': c.gruvfg,
						'--tw-prose-pre-code': c.gruvfg,
						'--tw-prose-pre-bg': c.gruvfg,
						'--tw-prose-th-borders': c.gruvfg,
						'--tw-prose-td-borders': c.gruvfg,
						'--tw-prose-invert-body': c.gruvdfg,
						'--tw-prose-invert-headings': c.gruvdfg0,
						'--tw-prose-invert-lead': c.gruvdfg2,
						'--tw-prose-invert-links': c.gruvdfg0,
						'--tw-prose-invert-bold': c.gruvdfg0,
						'--tw-prose-invert-counters': c.gruvdfg2,
						'--tw-prose-invert-bullets': c.gruvdfg3,
						'--tw-prose-invert-hr': c.gruvdfg4,
						'--tw-prose-invert-quotes': c.gruvdfg0,
						'--tw-prose-invert-quote-borders': c.gruvdfg4,
						'--tw-prose-invert-captions': c.gruvdfg2,
						'--tw-prose-invert-kbd': c.gruvdfg0,
						'--tw-prose-invert-kbd-shadows': hexToRgb(c.gruvdfg0),
						'--tw-prose-invert-code': c.gruvdfg0,
						'--tw-prose-invert-pre-code': c.gruvdfg,
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': c.gruvdfg3,
						'--tw-prose-invert-td-borders': c.gruvdfg4
					}
				}
			},
			colors: {
				...c,
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};

export default config;
