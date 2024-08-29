import { slugFromPath } from '$lib/util';
import { json } from '@sveltejs/kit';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import { compile } from 'mdsvex';
import mdsvexConfig from '../../../../mdsvex.config.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	console.log(`root article params: ${JSON.stringify(params, null, 2)}`);
	const articlenames = await fg.glob([
		'../../articles/**/*.{md,svx,svelte.md}'
	]);

	for (const [key, value] of url.searchParams) {
		console.log(`root article searchParams: ${key} = ${value}`);
	}

	const articlePromises = [];
	const category = url.searchParams.get('category') ?? null;
	const slug = url.searchParams.get('slug') ?? null;

	for (const path of articlenames) {
		console.log(`root article path: ${path}`);
		const [articleCategory, articleName] =
			path.match(/\.\.\/\.\.\/articles\/(.*)\/(.*)$/i)?.slice(1, 3) ?? null;
		const articleSlug = slugFromPath(path);
		if (!category || articleCategory === category) {
			if (articleSlug === slug) {
				const promise = fs
					.readFile(path, { encoding: 'utf8' })
					.then((article) => {
						console.log('Article: ', article);
						console.log(`article in json: ${JSON.stringify(article, null, 2)}`);
						console.log(`slug: ${JSON.stringify(slug, null, 2)}`);
						return {
							slug,
							articleCategory,
							articleName,
							...article.metadata
						};
					});
				articlePromises.push(promise);
			}
		}
	}

	const articles = await Promise.all(articlePromises);
	console.log('Articles: ', articles);
	const publishedArticles = articles.filter((article) => article.published);

	publishedArticles.sort((a, b) =>
		new Date(a.creationDate) > new Date(b.creationDate) ? -1 : 1
	);

	console.log(
		`publishedArticles: ${JSON.stringify(publishedArticles, null, 2)}`
	);
	return json(publishedArticles);
}
