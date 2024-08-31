import { slugFromPath } from '$lib/util';
import { json } from '@sveltejs/kit';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import { unified } from 'unified';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { matter } from 'vfile-matter';

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFile} VFile
 */
function remarkGetFm() {
	return function (tree, file) {
		matter(file);
	};
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	const articlenames = await fg.glob(['./articles/**/*.{md,svx,svelte.md}']);

	// for (const [key, value] of url.searchParams) {
	// 	console.log(`root articles index searchParams: ${key} = ${value}`);
	// }

	const articlePromises = [];
	const limit = Number(url.searchParams.get('limit') ?? Infinity);
	const category = url.searchParams.get('category') ?? null;

	if (Number.isNaN(limit)) {
		return json({
			status: 400
		});
	}

	for (const path of articlenames) {
		// console.log(`root article path: ${path}`);
		const [articleCategory, articleName] =
			path.match(/\.\/articles\/(.*)\/(.*)$/i)?.slice(1, 3) ?? null;
		const articleSlug = slugFromPath(path);
		if (!category || articleCategory === category) {
			const promise = fs
				.readFile(path, { encoding: 'utf8' })
				.then(async (article) => {
					// only extracting frontmatter
					const vfile = await unified()
						.use(remarkParse)
						.use(remarkStringify)
						.use(remarkFrontmatter)
						.use(remarkGetFm)
						.process(article);
					return {
						slug: articleSlug,
						articleCategory,
						articleName,
						...vfile.data.matter
					};
				});
			articlePromises.push(promise);
		}
	}

	const articles = await Promise.all(articlePromises);
	const publishedArticles = articles
		.filter((article) => article.published)
		.slice(0, limit);

	publishedArticles.sort((a, b) =>
		new Date(a.creationDate) > new Date(b.creationDate) ? -1 : 1
	);

	// console.log(publishedArticles);
	return json(publishedArticles.slice(0, limit));
}
