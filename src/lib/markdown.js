import { unified } from 'unified';
import { u } from 'unist-builder';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import { matter } from 'vfile-matter';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import remarkGithub from 'remark-github';
import remarkEmoji from 'remark-emo';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkMath from 'remark-math';
// import remarkToc from 'remark-toc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkSupersub from 'remark-supersub';
import rehypeSlug from 'rehype-slug';
import rehypeMathjax from 'rehype-mathjax';
import rehypeStringify from 'rehype-stringify';
// import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeToc from '@jsdevtools/rehype-toc';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import {
	transformerNotationDiff,
	transformerNotationHighlight
} from '@shikijs/transformers';
import c from '../configs/gruvbox_colors.js';
import { theme as gruvboxTheme } from '../configs/gruvbox_shiki.js';
import githubTheme from 'shiki/themes/github-light-high-contrast.mjs';

function remarkGetFm() {
	// this gets the frontmatter in YAML into data.matter
	return (_tree, file) => {
		matter(file);
	};
}

// function rehypeWrapMain() {
// 	// this function inserts a new 'main' element directly underneath 'root'
// 	// so that the toc generation can add the 'nav' in a sepoarate element
// 	return function (tree) {
// 		let newtree = {};
// 		visit(tree, (node) => {
// 			if (node.type === 'root') {
// 				newtree = u(
// 					'element',
// 					h('main', {
// 						class:
// 							'markdown prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert'
// 					}),
// 					[...node.children]
// 				);
// 				node.children = [newtree];
// 			}
// 		});
// 	};
// }

function rehypePrependToc(tree) {
	// this function inserts a new heading element before the gathered ordered list
	// and also checks for an otherwise empty toc
	let empty = false;
	visit(tree, (node) => {
		if (node.tagName === 'nav') {
			const newtree = u(
				'element',
				h('#tocwrapper.tocwrapper', [
					h(
						'h2',
						{
							class: 'mb-2 text-gruvpurple dark:text-gruvyellow'
						},
						['On this page']
					),
					...node.children
				])
			);
			node.children = [newtree];
		} else if (node.tagName === 'ol') {
			// we determine if the list is empty here
			if (node.children.length === 0) empty = true;
		} else if (node.tagName === 'li') {
			node.properties.id = `toc-${node.children[0].properties.href.slice(1)}`;
		}
	});
	if (empty) {
		return false;
	}
	return tree;
}

function rehypeSplitTree(tree) {
	// this function splits the tree at the sveltecomponents
	const trees = { main: [], nav: [] };
	let newtree = u('root', []);
	for (const node of tree.children) {
		// visit(tree, (node) => {
		// if (node.type === 'root') {
		// 	newtree = u('root', []);
		if (node.tagName === 'sveltecomponent') {
			// push current tree
			trees.main.push(newtree);
			node.type = 'svelte';
			trees.main.push(node);
			newtree = u('root', []);
		} else if (node.tagName === 'nav') {
			// push current tree
			trees.main.push(newtree);
			newtree = u('root', [node]);
			trees.nav.push(newtree);
			newtree = u('root', []);
		} else {
			newtree.children.push(node);
		}
	}
	if (newtree.children.length > 0) {
		trees.main.push(newtree);
	}
	return trees;
}

// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
function remarkDirectiveHandler() {
	// console.log('In myRemarkPlugin');
	const directiveNames = ['note', 'svelte', 'comment', 'img', 'div', 'toc'];
	return (tree) => {
		visit(tree, (node) => {
			// console.log(node);
			if (
				// textDirective is :name[content]{attribute}
				node.type === 'textDirective' ||
				// leafdirective is ::name[content]{attributes}
				node.type === 'leafDirective' ||
				// containerDirective is :::name\ncontent\n:::
				node.type === 'containerDirective'
			) {
				if (!directiveNames.includes(node.name)) return;

				const data = node.data || (node.data = {});
				const attributes = node.attributes || {};
				let tagName = node.type === 'textDirective' ? 'span' : 'div';

				// special treatment for svelte components
				if (node.name === 'svelte') {
					tagName = 'sveltecomponent';
				}
				const hast = h(tagName, attributes);
				data.hName = hast.tagName;
				data.hProperties = hast.properties;
			}
		});
	};
}

function changeTheme(theme) {
	// tweak light theme only slighly
	theme.colors['editor.background'] = c.gruvlbg0s;
	for (const tc of theme.tokenColors) {
		let tcSet = tc.scope;
		if (tcSet) {
			if (Array.isArray(tc.scope)) {
				tcSet = tc.scope.join(' ');
			}
			if (tcSet.includes('comment')) {
				tc.settings.fontStyle = 'italic';
			}
		}
	}
}

// function remarkDebug() {
// 	return (tree) => {
// 		visit(tree, (node) => {
// 			console.log(node);
// 		});
// 	};
// }

// function rehypeDebug() {
// 	return (tree) => {
// 		console.log(tree);
// 		visit(tree, (node) => {
// 			console.log(node);
// 		});
// 	};
// }

async function preprocess(article) {
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
		engine: createOnigurumaEngine(() => import('shiki/wasm'))
	});

	changeTheme(githubTheme);

	const processor = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkGetFm)
		.use(remarkDirective)
		.use(remarkDirectiveHandler)
		// // .use(remarkToc, {
		// // 	heading: '(table[ -]of[ -])?contents?|toc|Inhalt',
		// // 	maxDepth: 2,
		// // 	tight: true,
		// // 	prefix: 'user-content-'
		// // })
		// // .use(remarkDebug)
		.use(remarkEmoji, { emoticon: true })
		.use(remarkGithub, {
			repository: 'https://github.com/michaelrommel/blog'
		})
		.use(remarkGfm, { singleTilde: false })
		.use(remarkMath, { singleDollarTextMath: false })
		.use(remarkSupersub)
		.use(remarkSmartypants, {
			backticks: false,
			dashes: 'oldschool',
			ellipses: 'unspaced'
		})
		// .use(remarkDebug)
		.use(remarkRehype)
		.use(rehypeSlug, { prefix: 'user-content-' })
		.use(rehypeAutolinkHeadings, { behaviour: 'wrap' })
		// // .use(rehypeSanitize, {
		// // 	...defaultSchema,
		// // 	clobberPrefix: '',
		// // 	attributes: {
		// // 		...defaultSchema.attributes,
		// // 		// The `language-*` regex is allowed by default.
		// // 		div: [
		// // 			...(defaultSchema.attributes.div || []),
		// // 			[
		// // 				'className',
		// // 				/^language-./,
		// // 				'math-inline',
		// // 				'math-display',
		// // 				'grid-left-right',
		// // 				'img-right',
		// // 				'toc'
		// // 			]
		// // 		],
		// // 		span: [
		// // 			...(defaultSchema.attributes.span || []),
		// // 			['className', 'line', 'math-inline']
		// // 		],
		// // 		sveltecomponent: [
		// // 			'componentname',
		// // 			'data',
		// // 			'xSelector',
		// // 			'file',
		// // 			'dpr',
		// // 			'inertia'
		// // 		]
		// // 	},
		// // 	tagNames: [...defaultSchema.tagNames, 'sveltecomponent']
		// // })
		// // .use(rehypeWrapMain)
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
			defaultColor: false,
			defaultLanguage: 'text',
			fallbackLanguage: 'text',
			transformers: [transformerNotationDiff(), transformerNotationHighlight()]
		})
		.use(rehypeMathjax)
		.use(rehypeToc, {
			headings: ['h2'],
			position: 'beforeend',
			// cssClasses: {
			// 	toc: 'prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert'
			// },
			customizeTOC: rehypePrependToc
		})
		.use(rehypeStringify);
	// .use(rehypeDebug)
	// .process(article);

	// parse articel into tree
	// console.log('start of parsing');
	const tree1 = await processor.parse(article);
	// console.log(tree1);
	// console.log('end of parsing');
	// run all transformers on the tree
	const tree2 = await processor.run(tree1);
	// split the tree into different ones, not reallocating the tree objects
	const trees = await rehypeSplitTree(tree2);
	// const html = await processor.stringify(trees[0]);
	highlighter.dispose();
	return trees;
}

export async function preProcessMarkDown(data) {
	const trees = await preprocess(data);
	return trees;
}

export async function processTree(tree) {
	const html = unified().use(rehypeStringify).stringify(tree);
	return html;
}

// export async function parseMarkdown(data) {
// 	const parsedArticle = await compile(data);
// 	// return parsedArticle.value;
// 	return parsedArticle;
// }
