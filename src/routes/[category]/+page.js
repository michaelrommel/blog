import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	let cardDataList = null;
	cardDataList = await fetch(`/api/articles?category=${params.category}`).then(
		(res) => res.json()
	);
	// console.log(`cat index pathname: ${JSON.stringify(url.pathname, null, 2)}`);
	// console.log(`cat params: ${JSON.stringify(params, null, 2)}`);
	// console.log(`articles: ${JSON.stringify(cardDataList, null, 2)}`);

	if (!cardDataList) {
		error(404, {
			message: 'Article list could not be retrieved'
		});
	}

	return {
		cards: cardDataList
	};
}
