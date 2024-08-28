// import { mdsvex } from 'mdsvex';
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
// import mdsvexConfig from './mdsvex.config.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},

	//preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
	preprocess: [vitePreprocess()],
	extensions: ['.svelte', '.md']
};

export default config;
