/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	console.log(`slug svelte params: ${JSON.stringify(params, null, 2)}`);

	let articles = null;
	articles = await fetch(
		`/api/article?category=${params.category}&slug=${params.slug}`
	).then((res) => res.json());

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

	//const parsedArticle = await compile(articles[0].md, mdsvexConfig);
	// console.log(articles[0]);

	return {
		html: articles[0].html
	};
}
