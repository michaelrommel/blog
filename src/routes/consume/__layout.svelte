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
  import PageHead from '$lib/components/PageHead.svelte';

  export let post;
</script>

<PageHead title={post.title} description={post.description} />

<slot />
