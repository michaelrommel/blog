import { slugFromPath, categoryFromPath } from '$lib/util';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url, params }) {
  for (const [key, value] of url.searchParams) {
    console.log(`root index searchParams: ${key} = ${value}`);
  }
  const modules = import.meta.glob('./**/*.{md,svx,svelte.md}');

  const articlePromises = [];
  const limit = Number(url.searchParams.get('limit') ?? Infinity);
  const category = url.searchParams.get('category') ?? null;

  if (Number.isNaN(limit)) {
    return {
      status: 400
    };
  }

  for (const [path, resolver] of Object.entries(modules)) {
    // console.log(`path: ${path}, resolver: ${resolver}`);
    const [articleCategory, articleName] =
      path.match(/\.\/(.*)\/(.*)$/i)?.slice(1, 3) ?? null;
    const slug = slugFromPath(path);
    if (!category || articleCategory === category) {
      const promise = resolver().then((article) => {
        // console.log(`article: ${JSON.stringify(article, null, 2)}`);
        return {
          slug,
          articleCategory,
          articleName,
          ...article.metadata
        };
      });
      articlePromises.push(promise);
    }
  }

  const articles = await Promise.all(articlePromises);
  // console.log(articles);
  const publishedArticles = articles
    .filter((article) => article.published)
    .slice(0, limit);

  publishedArticles.sort((a, b) =>
    new Date(a.creationDate) > new Date(b.creationDate) ? -1 : 1
  );

  return {
    body: publishedArticles.slice(0, limit)
  };
}
