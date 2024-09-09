import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import { matter } from 'vfile-matter';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import remarkGithub from 'remark-github';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeMathjax from 'rehype-mathjax';
import rehypeStringify from 'rehype-stringify';

import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { createHighlighterCore } from 'shiki/core';
import {
	transformerNotationDiff,
	transformerNotationHighlight
} from '@shikijs/transformers';
import c from '../../../configs/gruvbox_colors.js';
import { theme as gruvboxTheme } from '../../../configs/gruvbox_shiki.js';
import { default as githubTheme } from 'shiki/themes/github-light.mjs';

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFile} VFile
 */
function remarkGetFm() {
	// this gets the frontmatter in YAML into data.matter
	return function (tree, file) {
		matter(file);
	};
}

// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
// /** @type {import('unified').Plugin<[], import('mdast').Root>} */
function remarkDirectiveHandler() {
	// console.log('In myRemarkPlugin');
	const directiveNames = ['note', 'comment', 'img', 'div'];
	return (tree) => {
		visit(tree, (node) => {
			// console.log(node);
			if (
				node.type === 'textDirective' ||
				node.type === 'leafDirective' ||
				node.type === 'containerDirective'
			) {
				if (!directiveNames.includes(node.name)) return;

				const data = node.data || (node.data = {});
				const attributes = node.attributes || {};
				const tagName = node.type === 'textDirective' ? 'span' : 'div';

				data.hName = tagName;
				data.hProperties = h(tagName, attributes).properties;
			}
		});
	};
}

async function compile(article) {
	const highlighter = await createHighlighterCore({
		langs: [
			import('shiki/langs/js.mjs'),
			import('shiki/langs/shellsession.mjs'),
			import('shiki/langs/shell.mjs'),
			import('shiki/langs/bash.mjs'),
			import('shiki/langs/zsh.mjs'),
			import('shiki/langs/powershell.mjs'),
			import('shiki/langs/lua.mjs'),
			import('shiki/langs/rust.mjs'),
			import('shiki/langs/python.mjs'),
			import('shiki/langs/toml.mjs'),
			import('shiki/langs/yaml.mjs')
		],
		loadWasm: import('shiki/wasm')
	});

	// const githubTheme = await highlighter.loadTheme('github-light');
	githubTheme.colors['editor.background'] = c.gruvlbg1;

	const vfile = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkGetFm)
		.use(remarkDirective)
		.use(remarkDirectiveHandler)
		.use(remarkEmoji)
		.use(remarkGithub, { repository: 'https://github.com/michaelrommel/blog' })
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkRehype)
		.use(rehypeAutolinkHeadings, { behaviour: 'wrap' })
		.use(rehypeShikiFromHighlighter, highlighter, {
			themes: {
				dark: gruvboxTheme,
				light: githubTheme
			},
			langs: [
				'js',
				'shellsession',
				'shell',
				'bash',
				'zsh',
				'powershell',
				'lua',
				'rust',
				'python',
				'toml',
				'yaml'
			],
			defaultLanguage: 'text',
			fallbackLanguage: 'text',
			transformers: [transformerNotationDiff(), transformerNotationHighlight()]
		})
		.use(rehypeMathjax)
		.use(rehypeStringify)
		.process(article);
	highlighter.dispose();
	return vfile;
}

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	// console.log(`slug svelte params: ${JSON.stringify(params, null, 2)}`);

	let articles = null;
	articles = await fetch(
		`/api/article?category=${params.category}&slug=${params.slug}`
	).then((res) => res.json());

	if (!articles) {
		return {
			status: 404,
			error: new Error('Article could not be found')
		};
	}

	if (articles.length > 1) {
		return {
			status: 404,
			error: new Error('Multiple articles with that slug found!')
		};
	}

	const parsedArticle = await compile(articles[0].md);
	// console.log(parsedArticle);

	return {
		html: parsedArticle.value
	};
}
