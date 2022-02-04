<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ url, params, fetch }) {
    console.log(
      `slug svelte pathname: ${JSON.stringify(url.pathname, null, 2)}`
    );
    console.log(`slug svelte params: ${JSON.stringify(params, null, 2)}`);
    let article = null;
    // if (url.pathname.match(/.*\.(md|svx|svelte\.md)/i)) {
    const short = url.pathname;
    // const short = url.pathname.replace(
    //   /.*?([^\/]+)\.(md|svx|svelte\.md)$/g,
    //   '$1'
    // );
    console.log(`slug svelge short: ${short}`);
    article = await fetch(`${short}.json`).then((res) => {
      console.log(`slug svelte res: ${JSON.stringify(res, null, 2)}`);
      return res.json();
    });
    console.log(`slug svelte article: ${JSON.stringify(article, null, 2)}`);
    if (!article || !article.published) {
      return {
        status: 404,
        error: new Error('Article could not be found')
      };
    }
    // }
    return {
      props: {
        article
      }
    };
  }
</script>

<script>
  import '../../app.css';
  export let article;
</script>

<div class="mdsvx">
  {article}
</div>
