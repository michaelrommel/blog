// import { mdsvex } from 'mdsvex';
// import mdsvexConfig from './mdsvex.config.js';
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},

	//preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
	//preprocess: [vitePreprocess()],
	preprocess: [sveltePreprocess()],
	extensions: ['.svelte', '.md']
};

export default config;
