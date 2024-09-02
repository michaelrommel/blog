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
export default {
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
			mono: ['"Noto Sans Mono"', ...defaultTheme.fontFamily.mono]
		},
		extend: {
			screens: {
				xs: '375px'
			},
			colors: c,
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
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};