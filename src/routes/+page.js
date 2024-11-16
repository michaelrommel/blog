import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	// console.log(`root index category params: ${JSON.stringify(params, null, 2)}`);
	let cardDataList = null;
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

	if (!cardDataList) {
		error(404, {
			message: 'Article list could not be retrieved'
		});
	}

	return {
		cards: cardDataList
	};
}
