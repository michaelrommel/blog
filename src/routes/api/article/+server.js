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

export async function GET({ url }) {
	const category = url.searchParams.get('category') ?? null;
	const slug = url.searchParams.get('slug') ?? null;
	const articlepaths = await fg.glob([`../articles/${category}/${[slug]}.md`]);

	const articlePromises = [];

	for (const path of articlepaths) {
		// console.log(`root article path: ${path}`);
		const [articleName] =
			path.match(/\.\.\/articles\/.*\/(.*)$/i)?.slice(1, 3) ?? null;
		const promise = fs
			.readFile(path, { encoding: 'utf8' })
			.then(async (article) => {
				// console.log('Article: ', article);
				// only extracting frontmatter
				const vfile = await unified()
					.use(remarkParse)
					.use(remarkStringify)
					.use(remarkFrontmatter)
					.use(remarkGetFm)
					.process(article);
				return {
					slug,
					category,
					articleName,
					md: article,
					...vfile.data.matter
				};
			});
		articlePromises.push(promise);
	}

	const articles = await Promise.all(articlePromises);
	// console.log('Articles: ', articles);
	const publishedArticles = articles.filter((article) => article.published);

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
	return json(publishedArticles);
}
