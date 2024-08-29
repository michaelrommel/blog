import { slugFromPath } from '$lib/util';
/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }) {
	// console.log(`slug svelte pathname: ${JSON.stringify(url.pathname, null, 2)}`);
	// console.log(`slug svelte params: ${JSON.stringify(params, null, 2)}`);

	let articles = null;
	articles = await fetch(`/api/article?slug=${params.slug}`).then((res) =>
		res.json()
	);
	// console.log(`articles: ${JSON.stringify(articles, null, 2)}`);

	if (!articles) {
		return {
			status: 404,
			error: new Error('Article could not be found')
		};
	}

	if (articles.length > 1) {
		return {
			status: 404,
			error: new Error('Multiple articles with that slug found!')
		};
	}

	return {
		code: articles[0].code
	};
}
