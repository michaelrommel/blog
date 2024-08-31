import { slugFromPath } from '$lib/util';
import { json } from '@sveltejs/kit';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
// import { unified } from 'unified';
// import remarkFrontmatter from 'remark-frontmatter';
// import remarkParse from 'remark-parse';
// import remarkStringify from 'remark-stringify';
// import { matter } from 'vfile-matter';
import { compile } from 'mdsvex';
import mdsvexConfig from '../../../configs/mdsvex.config.js';

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFile} VFile
 */
// function myUnifiedPluginHandlingYamlMatter() {
// 	return function (tree, file) {
// 		matter(file);
// 	};
// }

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const category = url.searchParams.get('category') ?? null;
	const slug = url.searchParams.get('slug') ?? null;
	const articlepaths = await fg.glob([`./articles/${category}/${[slug]}.md`]);

	const articlePromises = [];

	for (const path of articlepaths) {
		// console.log(`root article path: ${path}`);
		const [articleName] =
			path.match(/\.\/articles\/.*\/(.*)$/i)?.slice(1, 3) ?? null;
		const promise = fs
			.readFile(path, { encoding: 'utf8' })
			.then(async (article) => {
				// console.log('Article: ', article);
				// only extracting frontmatter
				// const vfile = await unified()
				// 	.use(remarkParse)
				// 	.use(remarkStringify)
				// 	.use(remarkFrontmatter)
				// 	.use(myUnifiedPluginHandlingYamlMatter)
				// 	.process(article);
				// console.log(vfile.data.matter);
				// only extracting frontmatter
				const compiledArticle = await compile(article, mdsvexConfig);
				// console.log(compiledArticle.code);
				return {
					slug,
					category,
					articleName,
					html: compiledArticle.code,
					...compiledArticle.data.fm
				};
			});
		articlePromises.push(promise);
	}

	const articles = await Promise.all(articlePromises);
	// console.log('Articles: ', articles);
	const publishedArticles = articles.filter((article) => article.published);

	publishedArticles.sort((a, b) =>
		new Date(a.creationDate) > new Date(b.creationDate) ? -1 : 1
	);

	// console.log(
	// 	`publishedArticles: ${JSON.stringify(publishedArticles, null, 2)}`
	// );
	return json(publishedArticles);
}
