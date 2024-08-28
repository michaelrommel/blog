// Register `hName`, `hProperties` types, used when turning markdown to HTML:
/// <reference types="mdast-util-to-hast" />
// Register directive nodes in mdast:
/// <reference types="mdast-util-directive" />

import { h } from 'hastscript';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { read } from 'to-vfile';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const file = await unified()
	.use(remarkParse)
	.use(remarkDirective)
	.use(myRemarkPlugin)
	.use(remarkRehype)
	.use(rehypeFormat)
	.use(rehypeStringify)
	.process(
		await read(
			'src/routes/articles/create/2022-02-02-turntable-trigonometry.md'
		)
	);

console.log(String(file));

// This plugin is an example to let users write HTML with directives.
// It’s informative but rather useless.
// See below for others examples.
function myRemarkPlugin() {
	/**
	 * @param {import('mdast').Root} tree
	 *   Tree.
	 * @returns {undefined}
	 *   Nothing.
	 */
	return function (tree) {
		visit(tree, function (node) {
			if (
				node.type === 'containerDirective' ||
				node.type === 'leafDirective' ||
				node.type === 'textDirective'
			) {
				const data = node.data || (node.data = {});
				const hast = h(node.name, node.attributes || {});

				data.hName = hast.tagName;
				data.hProperties = hast.properties;
			}
		});
	};
}
