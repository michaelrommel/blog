import remarkGithub from 'remark-github';
import remarkEmoji from 'remark-emoji';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
/** @type {import('unified').Plugin<[], import('mdast').Root>} */
function myRemarkPlugin () {
  return (tree) => {
    visit(tree, (node) => {
      // console.log(node);
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        if (node.name !== 'note') return;

        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        const tagName = node.type === 'textDirective' ? 'span' : 'div';

        data.hName = tagName;
        data.hProperties = h(tagName, attributes).properties;
      }
    });
  };
}

const config = {
  extensions: ['.svelte.md', '.md', '.svx'],
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
    remarkGfm
  ],
  rehypePlugins: [
    [rehypeAutolinkHeadings, { behaviour: 'wrap' }]
  ]
};

export default config;
