// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	kit: {
		adapter: adapter()
		// csrf: {
		// 	// Add your local dev URL here to allow HTTPS origins in dev mode
		// 	trustedOrigins: ['https://dev.michaelrommel.com']
		// }
	},
	preprocess: [vitePreprocess()],
	extensions: ['.svelte', '.md']
};

export default config;
