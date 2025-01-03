const defaultTheme = require('tailwindcss/defaultTheme');
const c = require('./src/configs/gruvbox_colors.js');

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
	//darkMode: 'media',
	darkMode: ['class'],
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/layerchart/**/*.{svelte,js}'
	],
	safelist: ['dark'],
	theme: {
		// container: {
		// 	center: true,
		// 	padding: '2rem'
		// },
		screens: {
			xs: '25rem',
			sm: '35rem',
			md: '48rem',
			lg: '65rem',
			xl: '100rem',
			'2xl': '125rem'
		},
		fontFamily: {
			serif: ['RobotoSerif', ...defaultTheme.fontFamily.serif],
			sans: [...defaultTheme.fontFamily.sans],
			mono: ['LuxiMono', 'RobotoMono', ...defaultTheme.fontFamily.mono]
		},
		extend: {
			typography: {
				gruvbox: {
					css: {
						maxWidth: 'min(75ch, 100%)',
						code: {
							fontWeight: '500'
						},
						'--tw-prose-body': c.gruvlfg,
						'--tw-prose-headings': c.gruvlfg,
						'--tw-prose-lead': c.gruvlfg,
						'--tw-prose-links': c.gruvlfg,
						'--tw-prose-bold': c.gruvlfg,
						'--tw-prose-counters': c.gruvlfg,
						'--tw-prose-bullets': c.gruvlfg,
						'--tw-prose-hr': c.gruvlfg,
						'--tw-prose-quotes': c.gruvlfg,
						'--tw-prose-quote-borders': c.gruvlfg,
						'--tw-prose-captions': c.gruvlfg,
						'--tw-prose-code': c.gruvlfg,
						'--tw-prose-pre-code': c.gruvlfg,
						'--tw-prose-pre-bg': c.gruvlfg,
						'--tw-prose-th-borders': c.gruvlfg,
						'--tw-prose-td-borders': c.gruvlfg,
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
				// ...c,
				gruvred: 'hsl(var(--gruvred) / <alpha-value>)',
				gruvgreen: 'hsl(var(--gruvgreen) / <alpha-value>)',
				gruvyellow: 'hsl(var(--gruvyellow) / <alpha-value>)',
				gruvblue: 'hsl(var(--gruvblue) / <alpha-value>)',
				gruvpurple: 'hsl(var(--gruvpurple) / <alpha-value>)',
				gruvaqua: 'hsl(var(--gruvaqua) / <alpha-value>)',
				gruvorange: 'hsl(var(--gruvorange) / <alpha-value>)',
				gruvgray: 'hsl(var(--gruvgray) / <alpha-value>)',
				gruvdgray: 'hsl(var(--gruvdgray) / <alpha-value>)',
				gruvdbg: 'hsl(var(--gruvdbg) / <alpha-value>)',
				gruvdfg: 'hsl(var(--gruvdfg) / <alpha-value>)',
				gruvdemphred: 'hsl(var(--gruvdemphred) / <alpha-value>)',
				gruvdemphgreen: 'hsl(var(--gruvdemphgreen) / <alpha-value>)',
				gruvdemphyellow: 'hsl(var(--gruvdemphyellow) / <alpha-value>)',
				gruvdemphblue: 'hsl(var(--gruvdemphblue) / <alpha-value>)',
				gruvdemphpurple: 'hsl(var(--gruvdemphpurple) / <alpha-value>)',
				gruvdemphaqua: 'hsl(var(--gruvdemphaqua) / <alpha-value>)',
				gruvdemphorange: 'hsl(var(--gruvdemphorange) / <alpha-value>)',
				gruvdbg0: 'hsl(var(--gruvdbg0) / <alpha-value>)',
				gruvdbg0h: 'hsl(var(--gruvdbg0h) / <alpha-value>)',
				gruvdbghs: 'hsl(var(--gruvdbghs) / <alpha-value>)',
				gruvdbg1: 'hsl(var(--gruvdbg1) / <alpha-value>)',
				gruvdbg2: 'hsl(var(--gruvdbg2) / <alpha-value>)',
				gruvdbg3: 'hsl(var(--gruvdbg3) / <alpha-value>)',
				gruvdbg4: 'hsl(var(--gruvdbg4) / <alpha-value>)',
				gruvdfg0: 'hsl(var(--gruvdfg0) / <alpha-value>)',
				gruvdfg1: 'hsl(var(--gruvdfg1) / <alpha-value>)',
				gruvdfg2: 'hsl(var(--gruvdfg2) / <alpha-value>)',
				gruvdfg3: 'hsl(var(--gruvdfg3) / <alpha-value>)',
				gruvdfg4: 'hsl(var(--gruvdfg4) / <alpha-value>)',
				gruvlbg: 'hsl(var(--gruvlbg) / <alpha-value>)',
				gruvlfg: 'hsl(var(--gruvlfg) / <alpha-value>)',
				gruvlgray: 'hsl(var(--gruvlgray) / <alpha-value>)',
				gruvlemphred: 'hsl(var(--gruvlemphred) / <alpha-value>)',
				gruvlemphgreen: 'hsl(var(--gruvlemphgreen) / <alpha-value>)',
				gruvlemphyellow: 'hsl(var(--gruvlemphyellow) / <alpha-value>)',
				gruvlemphblue: 'hsl(var(--gruvlemphblue) / <alpha-value>)',
				gruvlemphpurple: 'hsl(var(--gruvlemphpurple) / <alpha-value>)',
				gruvlemphaqua: 'hsl(var(--gruvlemphaqua) / <alpha-value>)',
				gruvlemphorange: 'hsl(var(--gruvlemphorange) / <alpha-value>)',
				gruvlbg0: 'hsl(var(--gruvlbg0) / <alpha-value>)',
				gruvlbg0h: 'hsl(var(--gruvlbg0h) / <alpha-value>)',
				gruvlbg0s: 'hsl(var(--gruvlbg0s) / <alpha-value>)',
				gruvlbg1: 'hsl(var(--gruvlbg1) / <alpha-value>)',
				gruvlbg2: 'hsl(var(--gruvlbg2) / <alpha-value>)',
				gruvlbg3: 'hsl(var(--gruvlbg3) / <alpha-value>)',
				gruvlbg4: 'hsl(var(--gruvlbg4) / <alpha-value>)',
				gruvlfg0: 'hsl(var(--gruvlfg0) / <alpha-value>)',
				gruvlfg1: 'hsl(var(--gruvlfg1) / <alpha-value>)',
				gruvlfg2: 'hsl(var(--gruvlfg2) / <alpha-value>)',
				gruvlfg3: 'hsl(var(--gruvlfg3) / <alpha-value>)',
				gruvlfg4: 'hsl(var(--gruvlfg4) / <alpha-value>)',

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
				},
				// LayerChart tokens mapped to shadcn-svelte colors.
				surface: {
					content: 'hsl(var(--card-foreground) / <alpha-value>)',
					100: 'hsl(var(--background) / <alpha-value>)',
					200: 'hsl(var(---muted) / <alpha-value>)',
					300: 'hsl(var(--background) / <alpha-value>)'
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
