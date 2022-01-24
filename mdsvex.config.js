import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const config = {
  extensions: ['.svelte.md', '.md', '.svx'],
  smartypants: {
    dashes: 'oldschool'
  },
  remarkPlugins: [],
  rehypePlugins: [
    [
      rehypeAutolinkHeadings,
      {
        behaviour: 'wrap'
      }
    ]
  ]
};

export default config;
