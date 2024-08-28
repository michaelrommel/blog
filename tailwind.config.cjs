/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			xs: '375px',
			...defaultTheme.screens
		},
		extend: {
			colors: {
				gruvred: '#cc241d',
				gruvgreen: '#98971a',
				gruvyellow: '#d79921',
				gruvblue: '#458588',
				gruvpurple: '#b16286',
				gruvaqua: '#689d6a',
				gruvorange: '#d65d0e',
				gruvgray: '#928374',
				gruvdgray: '#a89984',
				gruvdbg: '#262626',
				gruvdfg: '#ebdbb2',
				gruvdemphred: '#fb4934',
				gruvdemphgreen: '#b8bb26',
				gruvdemphyellow: '#fabd2f',
				gruvdemphblue: '#83a598',
				gruvdemphpurple: '#d3869b',
				gruvdemphaqua: '#8ec07c',
				gruvdemphorange: '#fe8019',
				gruvdbg0: '#262626',
				gruvdbg0h: '#1d2021',
				gruvdbg0s: '#32302f',
				gruvdbg1: '#3c3836',
				gruvdbg2: '#504945',
				gruvdbg3: '#665c54',
				gruvdbg4: '#7c6f64',
				gruvdfg0: '#fbf1c7',
				gruvdfg1: '#ebdbb2',
				gruvdfg2: '#d5c4a1',
				gruvdfg3: '#bdae93',
				gruvdfg4: '#a89984',
				gruvlbg: '#fbf1c7',
				gruvlfg: '#3c3836',
				gruvlgray: '#7c6f64',
				gruvlemphred: '#9d0006',
				gruvlemphgreen: '#79740e',
				gruvlemphyellow: '#b57614',
				gruvlemphblue: '#076678',
				gruvlemphpurple: '#8f3f71',
				gruvlemphaqua: '#427b58',
				gruvlemphorange: '#af3a03',
				gruvlbg0: '#fbf1c7',
				gruvlbg0h: '#f9f5d7',
				gruvlbg0s: '#f2e5bc',
				gruvlbg1: '#ebdbb2',
				gruvlbg2: '#d5c4a1',
				gruvlbg3: '#bdae93',
				gruvlbg4: '#a89984',
				gruvlfg0: '#282828',
				gruvlfg1: '#3c3836',
				gruvlfg2: '#504945',
				gruvlfg3: '#665c54',
				gruvlfg4: '#7c6f64'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
