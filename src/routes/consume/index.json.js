import { slugFromPath } from '$lib/util';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get ({ url }) {
  const modules = import.meta.glob('./*.{md,svx,svelte.md}');

  const articlePromises = [];
  const limit = Number(url.searchParams.get('limit') ?? Infinity);

  if (Number.isNaN(limit)) {
    return {
      status: 400
    };
  }

  for (const [path, resolver] of Object.entries(modules)) {
    console.log(`path: ${path}, resolver: ${resolver}`);
    const slug = slugFromPath(path);
    const promise = resolver().then((article) => {
      console.log(article);
      return {
        slug,
        ...article.metadata
      };
    });

    articlePromises.push(promise);
  }

  const articles = await Promise.all(articlePromises);
  console.log(articles);
  const publishedArticles = articles.filter(
    (article) => article.published
  ).slice(0, limit);

  publishedArticles.sort(
    (a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1)
  );

  return {
    body: publishedArticles.slice(0, limit)
  };
}
