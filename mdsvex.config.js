import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkGithub from 'remark-github';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
//import { getHighlighter } from 'shiki';
import { theme } from './gruvbox-theme.js';

// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
/** @type {import('unified').Plugin<[], import('mdast').Root>} */
function myRemarkPlugin() {
	console.log('In myRemarkPlugin');
	const directiveNames = ['note', 'comment', 'img', 'div'];
	return (tree) => {
		visit(tree, (node) => {
			console.log(node);
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

function myRehypePlugin() {
	return (tree, file) => {
		visit(tree, (node) => {
			// console.log(node);
		});
	};
}

async function myHighlighter(code, lang) {
	const highlighter = await getHighlighter({
		theme
	});

	let html = highlighter.codeToHtml(code, { lang });

	// additional html escapes that svelte needs
	const htmlEscapes = {
		'{': '&#123;',
		'}': '&#125;',
		'`': '&#96;',
		'\\': '\\\\'
	};

	html = html.replace(/[{}`\\]/g, (chr) => htmlEscapes[chr]);

	return `{@html \`${html}\` }`;
}

const config = {
	extensions: ['.md'],
	// highlight: {
	// 	highlighter: myHighlighter
	// },
	smartypants: {
		dashes: 'oldschool'
	},
	remarkPlugins: [
		remarkParse,
		remarkFrontmatter,
		remarkDirective,
		myRemarkPlugin,
		remarkEmoji,
		remarkGithub,
		remarkGfm,
		remarkMath
	],
	rehypePlugins: [
		[rehypeAutolinkHeadings, { behaviour: 'wrap' }],
		myRehypePlugin,
		rehypeMathjax
	]
};

export default config;
