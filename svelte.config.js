import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import adapter from '@sveltejs/adapter-vercel';
// import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import svg from '@poppanator/sveltekit-svg';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [preprocess(), mdsvex(mdsvexConfig)],

  kit: {
    adapter: adapter(),
    vite: {
      plugins: [
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
      ]
    }
  }
};

export default config;
