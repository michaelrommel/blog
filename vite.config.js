import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';

import { execSync } from 'node:child_process';

// Get current tag/commit and last commit date from git
let commit = execSync('git describe --tags || git rev-parse --short HEAD')
	.toString()
	.trim();
let modified = execSync(
	'git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M"'
)
	.toString()
	.trim();

export default defineConfig({
	assetsInclude: ['**/*.md', '**/*.stl'],
	plugins: [
		sveltekit(),
		tailwindcss(),
		Icons({
			compiler: 'svelte'
		}),
		svg({
			svgoOptions: {
				plugins: [
					'removeDimensions',
					{
						name: 'preset-default',
						params: {
							overrides: {
								removeViewBox: false
							}
						}
					},
					{
						name: 'removeAttributesBySelector',
						params: {
							selector: '[class="logostrokecolor"]',
							attributes: 'style'
						}
					}
				]
			}
		})
	],
	server: {
		allowedHosts: ['.michaelrommel.com'],
		fs: {
			allow: ['../articles/', 'resources/']
		}
	},
	define: {
		__COMMIT__: JSON.stringify(commit),
		__MODIFIED__: JSON.stringify(modified)
	}
});
