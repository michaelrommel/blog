import { slugFromPath } from '$lib/util';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	const modules = import.meta.glob('../../articles/**/*.{md,svx,svelte.md}');

	for (const [key, value] of url.searchParams) {
		console.log(`root articles index searchParams: ${key} = ${value}`);
	}

	const articlePromises = [];
	const limit = Number(url.searchParams.get('limit') ?? Infinity);
	const category = url.searchParams.get('category') ?? null;

	if (Number.isNaN(limit)) {
		return json({
			status: 400
		});
	}

	for (const [path, resolver] of Object.entries(modules)) {
		console.log(`root articles index path: ${path}, resolver: ${resolver}`);
		const [articleCategory, articleName] =
			path.match(/\.\.\/\.\.\/articles\/(.*)\/(.*)$/i)?.slice(1, 3) ?? null;
		const slug = slugFromPath(path);
		if (!category || articleCategory === category) {
			const promise = resolver().then((article) => {
				console.log(`article: ${JSON.stringify(article, null, 2)}`);
				console.log(`slug: ${JSON.stringify(slug, null, 2)}`);
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
	const publishedArticles = articles
		.filter((article) => article.published)
		.slice(0, limit);

	publishedArticles.sort((a, b) =>
		new Date(a.creationDate) > new Date(b.creationDate) ? -1 : 1
	);

	console.log(publishedArticles);
	return json(publishedArticles.slice(0, limit));
}
