import { slugFromPath } from '$lib/util';
import { json } from '@sveltejs/kit';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import { unified } from 'unified';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { matter } from 'vfile-matter';

function remarkGetFm() {
	return function (tree, file) {
		matter(file);
	};
}

export async function GET({ url, params }) {
	const category = url.searchParams.get('category') ?? null;
	const limit = Number(url.searchParams.get('limit') ?? Infinity);
	const articlenames = await fg.glob(['./articles/**/*.md']);

	const articlePromises = [];

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
	// console.log('Articles: ', articles);
	const publishedArticles = articles
		.filter((article) => article.published)
		.slice(0, limit);

	publishedArticles.sort((a, b) =>
		new Date(
			a.structuredData?.dateModified
				? a.structuredData?.dateModified
				: a.structuredData?.dateCreated
					? a.structuredData?.dateCreated
					: a.structuredData?.datePublished
						? a.structuredData?.datePublished
						: '2022-01-01T00:00:00+01:00'
		) >
		new Date(
			b.structuredData?.dateModified
				? b.structuredData?.dateModified
				: b.structuredData?.dateCreated
					? b.structuredData?.dateCreated
					: b.structuredData?.datePublished
						? b.structuredData?.datePublished
						: '2022-01-01T00:00:00+01:00'
		)
			? -1
			: 1
	);

	// console.log(
	// 	`publishedArticles: ${JSON.stringify(publishedArticles, null, 2)}`
	// );
	return json(publishedArticles.slice(0, limit));
}
