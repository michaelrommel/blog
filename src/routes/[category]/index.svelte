<script context="module">
  export async function load({ url, params, fetch }) {
    console.log(`category index pathname: ${JSON.stringify(url.pathname, null, 2)}`);
    console.log(`category params: ${JSON.stringify(params, null, 2)}`);
    let cardDataList = null;
    // if (url.pathname === '/') {
      cardDataList = await fetch(`index.json?category=${params.category}`).then(res => res.json());
      console.log(`articles: ${JSON.stringify(cardDataList, null, 2)}`);

      // if (!article || !article.published) {
      //   return {
      //     status: 404,
      //     error: new Error('Article could not be found')
      //   };
      // }
    // };

    return {
      props: {
        cardDataList
      }
    };
  }
</script>

<script>
  import '../../app.css';
  import Card from '$lib/components/Card.svelte';

  export let cardDataList;
</script>

<div class="flex flex-col">
{#each cardDataList as cardData}
  <div class="self-center">
    <a href="/{cardData.articleCategory}/{cardData.slug}">
      <Card cardData={cardData}/>
    </a>
  </div>
{/each}
</div>
