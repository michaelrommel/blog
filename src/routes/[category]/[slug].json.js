import { slugFromPath } from '$lib/util';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
  // console.log(`category slug param: ${JSON.stringify(params, null, 2)}`);

  let match;

  if (!match) {
    return {
      status: 404
    };
  }

  const article = await match[1]();

  return {
    body: article.metadata
  };
}
