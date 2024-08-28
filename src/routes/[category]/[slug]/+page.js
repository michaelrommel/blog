import { slugFromPath } from '$lib/util';
/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }) {
	console.log(`slug svelte pathname: ${JSON.stringify(url.pathname, null, 2)}`);
	console.log(`slug svelte params: ${JSON.stringify(params, null, 2)}`);

	let article = null;
	article = await fetch(`/api/article?slug=${params.slug}`).then((res) =>
		res.json()
	);
	console.log(`article: ${JSON.stringify(article, null, 2)}`);

	if (!article) {
		return {
			status: 404,
			error: new Error('Article could not be found')
		};
	}

	if (article.length > 1) {
		return {
			status: 404,
			error: new Error('Multiple articles with that slug found!')
		};
	}

	return article[0].article;

	// const modules = import.meta.glob('../../articles/**/*.{md,svx,svelte.md}');
	//
	// let match;
	// for (const path in modules) {
	// 	if (slugFromPath(path) === params.slug) {
	// 		match = modules[path];
	// 		break;
	// 	}
	// }
	//
	// if (!match) {
	// 	return {
	// 		status: 404,
	// 		error: new Error('Article could not be found')
	// 	};
	// }
	//
	// const article = await match();
	//
	// if (!article.metadata.published) {
	// 	return {
	// 		status: 404,
	// 		error: new Error('Article could not be found')
	// 	};
	// }
	// console.log(article);
	//
	// return {
	// 	article: article.default
	// };
}
