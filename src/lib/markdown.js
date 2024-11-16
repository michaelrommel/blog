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
import supersub from 'remark-supersub';
import rehypeMathjax from 'rehype-mathjax';
import rehypeStringify from 'rehype-stringify';

import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { createHighlighterCore } from 'shiki/core';
import {
	transformerNotationDiff,
	transformerNotationHighlight
} from '@shikijs/transformers';
import c from '../configs/gruvbox_colors.js';
import { theme as gruvboxTheme } from '../configs/gruvbox_shiki.js';
import githubTheme from 'shiki/themes/github-light-high-contrast.mjs';

function remarkGetFm() {
	// this gets the frontmatter in YAML into data.matter
	return function (tree, file) {
		matter(file);
	};
}

// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
function remarkDirectiveHandler() {
	// console.log('In myRemarkPlugin');
	const directiveNames = ['note', 'svelte', 'comment', 'img', 'div'];
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
				let attributes = node.attributes || {};
				let tagName = node.type === 'textDirective' ? 'span' : 'div';

				// special treatment for svelte components
				if (node.name === 'svelte') {
					tagName = 'SvelteComponent';
				}
				data.hName = tagName;
				data.hProperties = h(tagName, attributes).properties;
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

	changeTheme(githubTheme);

	const vfile = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkGetFm)
		.use(remarkDirective)
		.use(remarkDirectiveHandler)
		.use(remarkEmoji, { emoticon: true })
		.use(remarkGithub, {
			repository: 'https://github.com/michaelrommel/blog'
		})
		.use(remarkGfm, { singleTilde: false })
		.use(remarkMath)
		.use(supersub)
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
			defaultColor: false,
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

export async function parseMarkdown(data) {
	const parsedArticle = await compile(data);
	return parsedArticle.value;
}