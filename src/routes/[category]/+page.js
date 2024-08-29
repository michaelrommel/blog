/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }) {
	let cardDataList = null;
	cardDataList = await fetch(`/api/articles?category=${params.category}`).then(
		(res) => res.json()
	);
	// console.log(`cat index pathname: ${JSON.stringify(url.pathname, null, 2)}`);
	// console.log(`cat params: ${JSON.stringify(params, null, 2)}`);
	// console.log(`articles: ${JSON.stringify(cardDataList, null, 2)}`);

	if (!cardDataList) {
		return {
			status: 404,
			error: new Error('Article list could not be found')
		};
	}

	return {
		cards: cardDataList
	};
}
