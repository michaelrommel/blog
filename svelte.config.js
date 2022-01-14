import adapter from '@sveltejs/adapter-vercel';
// import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import svg from '@poppanator/sveltekit-svg';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
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
    },
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte'
  }
};

export default config;
