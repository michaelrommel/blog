const gruvboxColors = require('./gruvbox_colors.js');
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				xs: '375px'
			},
			colors: gruvboxColors
		}
	}
	/* plugins: [require('@tailwindcss/typography')] */
};
