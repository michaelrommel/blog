<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ url, fetch }) {
    const post = await fetch(`${url.pathname}.json`).then(res => res.json());

    if (!post || !post.published) {
      return {
        status: 404,
        error: new Error('Post could not be found')
      };
    }

    return {
      props: {
        post
      }
    };
  }
</script>

<script>
  import '../../app.css';
  import PageHead from '$lib/components/PageHead.svelte';

  export let post;
</script>

<PageHead title={post.title} description={post.description} />

<div class="grid grid-cols-12 gap-4 m-3">
  <div class="col-span-12">
    <slot />
  </div>
</div>

<style lang="postcss" global>

h1 {
  @apply text-2xl font-bold my-6;
}

h2 {
  @apply text-xl font-bold my-6;
}

h3 {
  @apply text-lg font-bold my-4;
}

h4 {
  @apply font-bold my-4;
}

p {
  @apply my-4 leading-snug;
}

.img-right {
  @apply max-w-2xl;
}

pre[class*="shiki"] > code,
code[class*="language-"],
pre[class*="language-"] {
  font-family: VictorMono, Consolas, Monaco, "Andale Mono", monospace;
  font-style: normal;
  /* font-size: 16px; */
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.0;

  -moz-tab-size: 2;
  -o-tab-size: 2;
  tab-size: 2;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}


/* gruvbox light */

/* prismjs gruvbox dark */

@media (prefers-color-scheme: dark) {
  code[class*="language-"],
  pre[class*="language-"] {
    background-color: theme('colors.gruvdbg0');
  }

  pre[class*="language-"]::-moz-selection,
  pre[class*="language-"] ::-moz-selection,
  code[class*="language-"]::-moz-selection,
  code[class*="language-"] ::-moz-selection {
    color: theme('colors.gruvdfg0');
    background-color: theme('colors.gruvdbg4');
  }

  pre[class*="language-"]::selection,
  pre[class*="language-"] ::selection,
  code[class*="language-"]::selection,
  code[class*="language-"] ::selection {
    color: theme('colors.gruvdfg0');
    background-color: theme('colors.gruvdbg4');
  }

  /* Code blocks */
  pre[class*="language-"] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
    background-color: theme('colors.gruvdbg0');
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
    padding: 0.1em;
    border-radius: 0.3em;
  }

  .token.comment,
  .token.prolog,
  .token.cdata {
    color: theme('colors.gruvgray');
    font-style: italic;
  }

  .token.hashbang {
    color: theme('colors.gruvaqua');
    font-style: normal;
  }

  .token.delimiter,
  .token.selector,
  .token.important,
  .token.atrule {
    color: theme('colors.gruvdemphorange');
  }

  .token.keyword {
    color: theme('colors.gruvdemphorange');
  }

  .token.operator,
  .token.attr-name {
    color: theme('colors.gruvdemphyellow');
  }

  .token.punctuation {
    color: theme('colors.gruvdfg3');
  }

  .token.interpolation-punctuation {
    color: theme('colors.gruvdemphaqua');
  }

  .token.tag,
  .token.tag .punctuation,
  .token.doctype,
  .token.builtin {
    color: theme('colors.gruvdemphyellow');
  }

  .token.class-name,
  .token.boolean,
  .token.entity,
  .token.number,
  .token.symbol {
    color: theme('colors.gruvdemphpurple');
  }

  .token.constant,
  .token.variable {
    color: theme('colors.gruvdemphred');
  }

  .token.property,
  .token.regex,
  .token.string,
  .token.char {
    color: theme('colors.gruvdemphgreen');
  }

  .token.attr-value,
  .token.attr-value .punctuation {
    color: theme('colors.gruvdfg4');
  }

  .token.url {
    color: theme('colors.gruvblue');
    text-decoration: underline;
  }

  .token.function {
    color: theme('colors.gruvdemphblue');
  }

  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.inserted {
    color: theme('colors.gruvdfg4');
  }

  .token.deleted {
    background: theme('colors.gruvdemphred');
  }
}

</style>
