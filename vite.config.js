import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	assetsInclude: ['**/*.md', '**/*.stl'],
	plugins: [
		sveltekit(),
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
		fs: {
			allow: ['articles/']
		}
	}
});
