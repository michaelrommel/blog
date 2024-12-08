import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	// console.log(`category index category params: ${JSON.stringify(params, null, 2)}`);
	let cardDataList = null;
	if (params.category) {
		cardDataList = await fetch(
			`/api/articles?category=${params.category}`
		).then((res) => res.json());
	} else {
		cardDataList = await fetch('/api/articles').then((res) => res.json());
	}
	// console.log(`category index pathname: ${JSON.stringify(url.pathname, null, 2)}`);
	// console.log(`category index category params: ${JSON.stringify(params, null, 2)}`);
	// console.log(
	// 	`category index articles: ${JSON.stringify(cardDataList, null, 2)}`
	// );

	if (!cardDataList || cardDataList.length === 0) {
		error(404, {
			message: 'Article list could not be retrieved'
		});
	}

	const cdlFiltered = cardDataList.filter((c) => c.articleCategory !== 'info');

	return {
		cards: cdlFiltered,
		title: `Article List ${params.category ? params.category.toUpperCase() : ''}`,
		description: `Articles ${params.category ? 'in category ' + params.category.toUpperCase() : ''}`
	};
}
