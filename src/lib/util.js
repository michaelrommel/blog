export const slugFromPath = (path) =>
	path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;
export const categoryFromPath = (path) =>
	path.match(/\.\/(.*)\/[\w-]+\.(svelte\.md|md|svx)/i)?.[1] ?? null;
export const chartcolours = {
	gruvred: 'hsl(0, 100%, 27%)',
	gruvgreen: 'hsl(60, 71%, 35%)',
	gruvyellow: 'hsl(40, 73%, 49%)',
	gruvblue: 'hsl(183, 33%, 40%)',
	gruvpurple: 'hsl(333, 34%, 54%)',
	gruvaqua: 'hsl(122, 21%, 51%)',
	gruvorange: 'hsl(24, 88%, 45%)',
	gruvgray: 'hsl(30, 12%, 51%)',
	gruvdgray: 'hsl(35, 17%, 59%)',
	gruvdemphred: 'hsl(6, 96%, 59%)',
	gruvdemphgreen: 'hsl(61, 66%, 44%)',
	gruvdemphyellow: 'hsl(42, 95%, 58%)',
	gruvdemphblue: 'hsl(157, 16%, 58%)',
	gruvdemphpurple: 'hsl(344, 47%, 68%)',
	gruvdemphaqua: 'hsl(104, 35%, 62%)',
	gruvdemphorange: 'hsl(27, 99%, 55%)',
	gruvlgray: 'hsl(28, 11%, 44%)',
	gruvlemphred: 'hsl(358, 100%, 31%)',
	gruvlemphgreen: 'hsl(57, 79%, 26%)',
	gruvlemphyellow: 'hsl(37, 80%, 39%)',
	gruvlemphblue: 'hsl(190, 89%, 25%)',
	gruvlemphpurple: 'hsl(323, 39%, 40%)',
	gruvlemphaqua: 'hsl(143, 30%, 37%)',
	gruvlemphorange: 'hsl(19, 97%, 35%)'
};
