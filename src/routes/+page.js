import { error } from '@sveltejs/kit';

export async function load({ params, fetch, data }) {
	// console.log(`root index category params: ${JSON.stringify(params, null, 2)}`);
	let cardDataList = null;
	let user = null;

	if (params.category) {
		cardDataList = await fetch(
			`/api/articles?category=${params.category}`
		).then((res) => res.json());
	} else {
		cardDataList = await fetch('/api/articles').then((res) => res.json());
	}
	// console.log(`root index pathname: ${JSON.stringify(url.pathname, null, 2)}`);
	// console.log(`root index category params: ${JSON.stringify(params, null, 2)}`);
	// console.log(`root index articles: ${JSON.stringify(cardDataList, null, 2)}`);

	if (!cardDataList || cardDataList.length === 0) {
		error(404, {
			message: 'Article list could not be retrieved'
		});
	}

	const cdlFiltered = cardDataList.filter((c) => c.articleCategory !== 'info');

	if (data.user !== undefined && data.user !== null) {
		user = data.user;
	}

	return {
		cards: cdlFiltered,
		title: `Overall Article List`,
		description: `Articles in all categories`,
		user
	};
}
