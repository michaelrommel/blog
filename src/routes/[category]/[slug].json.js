import { slugFromPath } from '$lib/util';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
  const modules = import.meta.glob('../**/*.{md,svx,svelte.md}');

  console.log(`slug json modules: ${JSON.stringify(modules, null, 2)}`);
  console.log(`slug json params: ${JSON.stringify(params, null, 2)}`);

  let match;
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromPath(path) === params.slug) {
      match = [path, resolver];
      break;
    }
  }

  if (!match) {
    return {
      status: 404,
      error: new Error('Article could not be found')
    };
  }

  const article = await match[1]();

  if (!article.metadata.published) {
    return {
      status: 404,
      error: new Error('Article could not be found')
    };
  }

  console.log(`slug json article: ${JSON.stringify(article, null, 2)}`);

  return {
    body: article.metadata
  };
}
