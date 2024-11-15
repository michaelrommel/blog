import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
	let articles = null;
	articles = await fetch(
		`/api/article?category=create&slug=2024-11-14-md-embeds-svelte`
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

	let hacksData = null;
	hacksData = await fetch('/api/hackers').then((res) => res.json());
	if (!hacksData) {
		error(404, {
			message: 'Data could not be retrieved'
		});
	}

	return {
		markdown: articles[0].md,
		chartdata: hacksData
	};
}
