<script context="module">
  import { slugFromPath } from '$lib/util';
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ url, params, fetch }) {
    console.log(
      `slug svelte pathname: ${JSON.stringify(url.pathname, null, 2)}`
    );
    console.log(`slug svelte params: ${JSON.stringify(params, null, 2)}`);

    const modules = import.meta.glob('../articles/**/*.{md,svx,svelte.md}');

    let match;
    for (const path in modules) {
      if (slugFromPath(path) === params.slug) {
        match = modules[path];
        break;
      }
    }

    if (!match) {
      return {
        status: 404,
        error: new Error('Article could not be found')
      };
    }

    const article = await match();

    if (!article.metadata.published) {
      return {
        status: 404,
        error: new Error('Article could not be found')
      };
    }

    return {
      props: {
        article: article.default
      }
    };
  }
</script>

<script>
  import '../../app.css';
  export let article;
</script>

<div class="mdsvx">
  <svelte:component this={article} />
</div>
