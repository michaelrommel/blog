import { error } from '@sveltejs/kit';
import fs from 'node:fs/promises';

export async function load({ params, fetch }) {
	let articles = null;
	articles = await fetch(
		`/api/article?category=${params.category}&slug=${params.slug}`
		//`/api/article?category=create&slug=2024-11-14-md-embeds-svelte`
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

	const md = articles[0].md;

	const frontmatterData = RegExp(
		'dataSource: (?<datasource>.+?)$.*dataUrl: (?<dataurl>.+?)$',
		'gsm'
	);

	let chartData = null;

	console.log(md);
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
				break;
			}
			case 'inline': {
				const dat = JSON.parse(match.groups.dataurl);
				//console.log(`inline: ${dat}`);
				chartData = { inline: dat };
				break;
			}
			case 'file': {
				try {
					const filedata = await fs.readFile(match.groups.dataUrl, {
						encoding: 'utf8'
					});
					//console.log(`file: ${filedata}`);
					chartData = { file: filedata };
				} catch {
					error(404, {
						message: 'Data could not be loaded'
					});
				}
				break;
			}
		}
	}

	// console.log(JSON.stringify(chartData));

	return {
		markdown: articles[0].md,
		chartdata: chartData
	};
}
