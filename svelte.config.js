// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	kit: {
		adapter: adapter()
	},

	preprocess: [vitePreprocess()],
	extensions: ['.svelte', '.md']
};

export default config;
