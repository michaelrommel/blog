import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	console.log(params);
	let articles = null;
	articles = await fetch(
		`/api/journalentry?year=${params.year}&slug=${params.slug}`
	).then((res) => res.json());
	console.log(articles);

	if (!articles || articles.length === 0) {
		error(404, {
			message: 'Article could not be found'
		});
	}

	if (articles.length > 1) {
		error(404, {
			message: 'Multiple articles with that slug found!'
		});
	}

	const md = articles[0].md;

	const title = articles[0].structuredData?.headline
		? articles[0].structuredData?.headline
		: articles[0].title;

	const description = articles[0].structuredData?.abstract
		? articles[0].structuredData?.abstract
		: articles[0].description;

	const frontmatterData = RegExp(
		'dataSource: (?<datasource>.+?)$.*dataUrl: (?<dataurl>.+?)$',
		'gsm'
	);

	let chartData = null;

	const matches = md.matchAll(frontmatterData);
	for (const match of matches) {
		const key = match.groups.datasource.replaceAll('"', '');
		switch (key) {
			case 'api': {
				const url = match.groups.dataurl.replaceAll('"', '');
				// console.log(`api: ${url}`);
				chartData = await fetch(`/api${url}`).then((res) => res.json());
				if (!chartData) {
					error(404, {
						message: 'Data could not be retrieved'
					});
				}
				// console.log(`chartData: ${JSON.stringify(chartData, null, 4)}`);
				break;
			}
			case 'inline': {
				const dat = JSON.parse(match.groups.dataurl);
				//console.log(`inline: ${dat}`);
				chartData = { inline: dat };
				// console.log(`chartData: ${JSON.stringify(chartData, null, 4)}`);
				break;
			}
			case 'url': {
				const url = match.groups.dataurl.replaceAll('"', '');
				// console.log(`url: ${url}`);
				const dataset = await fetch(`/articles/assets/${url}`).then((res) =>
					res.json()
				);
				if (!dataset) {
					error(404, {
						message: 'Data could not be retrieved'
					});
				}
				chartData = { dataset };
				// console.log(`chartData: ${JSON.stringify(chartData, null, 4)}`);
				break;
			}
		}
	}

	// console.log(JSON.stringify(chartData));

	return {
		markdown: articles[0].md,
		chartdata: chartData,
		title,
		description,
		structuredData: articles[0].structuredData
	};
}
