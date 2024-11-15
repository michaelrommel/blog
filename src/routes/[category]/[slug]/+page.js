import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	// console.log(`slug svelte params: ${JSON.stringify(params, null, 2)}`);

	let articles = null;
	articles = await fetch(
		`/api/article?category=${params.category}&slug=${params.slug}`
	).then((res) => res.json());

	if (!articles) {
		error(404, {
			message: 'Article could not be found'
		});
	}

	if (articles.length > 1) {
		error(404, {
			message: 'Multiple articles with that slug found!'
		});
	}

	return {
		md: articles[0].md
	};
}
