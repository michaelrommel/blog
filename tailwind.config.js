const c = require('./src/configs/gruvbox_colors.js');
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				xs: '375px'
			},
			colors: c,
			typography: {
				gruvbox: {
					css: {
						maxWidth: '90ch',
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
						'--tw-prose-invert-headings': c.gruvdfg,
						'--tw-prose-invert-lead': c.gruvdfg,
						'--tw-prose-invert-links': c.gruvdfg,
						'--tw-prose-invert-bold': c.gruvdfg,
						'--tw-prose-invert-counters': c.gruvdfg,
						'--tw-prose-invert-bullets': c.gruvdfg,
						'--tw-prose-invert-hr': c.gruvdfg,
						'--tw-prose-invert-quotes': c.gruvdfg,
						'--tw-prose-invert-quote-borders': c.gruvdfg,
						'--tw-prose-invert-captions': c.gruvdfg,
						'--tw-prose-invert-code': c.gruvdfg,
						'--tw-prose-invert-pre-code': c.gruvdfg,
						'--tw-prose-invert-pre-bg': c.gruvdfg,
						'--tw-prose-invert-th-borders': c.gruvdfg,
						'--tw-prose-invert-td-borders': c.gruvdfg
					}
				}
				// neutral: {
				// 	css: {
				// 		'--tw-prose-body': colors.neutral[700],
				// 		'--tw-prose-headings': colors.neutral[900],
				// 		'--tw-prose-lead': colors.neutral[600],
				// 		'--tw-prose-links': colors.neutral[900],
				// 		'--tw-prose-bold': colors.neutral[900],
				// 		'--tw-prose-counters': colors.neutral[500],
				// 		'--tw-prose-bullets': colors.neutral[300],
				// 		'--tw-prose-hr': colors.neutral[200],
				// 		'--tw-prose-quotes': colors.neutral[900],
				// 		'--tw-prose-quote-borders': colors.neutral[200],
				// 		'--tw-prose-captions': colors.neutral[500],
				// 		'--tw-prose-kbd': colors.neutral[900],
				// 		'--tw-prose-kbd-shadows': hexToRgb(colors.neutral[900]),
				// 		'--tw-prose-code': colors.neutral[900],
				// 		'--tw-prose-pre-code': colors.neutral[200],
				// 		'--tw-prose-pre-bg': colors.neutral[800],
				// 		'--tw-prose-th-borders': colors.neutral[300],
				// 		'--tw-prose-td-borders': colors.neutral[200],
				// 		'--tw-prose-invert-body': colors.neutral[300],
				// 		'--tw-prose-invert-headings': colors.white,
				// 		'--tw-prose-invert-lead': colors.neutral[400],
				// 		'--tw-prose-invert-links': colors.white,
				// 		'--tw-prose-invert-bold': colors.white,
				// 		'--tw-prose-invert-counters': colors.neutral[400],
				// 		'--tw-prose-invert-bullets': colors.neutral[600],
				// 		'--tw-prose-invert-hr': colors.neutral[700],
				// 		'--tw-prose-invert-quotes': colors.neutral[100],
				// 		'--tw-prose-invert-quote-borders': colors.neutral[700],
				// 		'--tw-prose-invert-captions': colors.neutral[400],
				// 		'--tw-prose-invert-kbd': colors.white,
				// 		'--tw-prose-invert-kbd-shadows': hexToRgb(colors.white),
				// 		'--tw-prose-invert-code': colors.white,
				// 		'--tw-prose-invert-pre-code': colors.neutral[300],
				// 		'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
				// 		'--tw-prose-invert-th-borders': colors.neutral[600],
				// 		'--tw-prose-invert-td-borders': colors.neutral[700]
				// 	}
				// }
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
