<script context="module">
  export async function load({ url, params, fetch }) {
    let cardDataList = null;
    cardDataList = await fetch('index.json').then((res) => res.json());
    console.log(`root index pathname: ${JSON.stringify(url.pathname, null, 2)}`);
    console.log(`root index category params: ${JSON.stringify(params, null, 2)}`);
    console.log(`root index articles: ${JSON.stringify(cardDataList, null, 2)}`);

    if (!cardDataList) {
      return {
        status: 404,
        error: new Error('Article list could not be found')
      };
    }

    return {
      props: {
        cardDataList
      }
    };
  }
</script>

<script>
  import '../app.css';
  import Card from '$lib/components/Card.svelte';

  export let cardDataList;
</script>

<div class="flex flex-col">
  {#each cardDataList as cardData}
    <div class="self-center">
      <a href="/{cardData.articleCategory}/{cardData.slug}">
        <Card {cardData} />
      </a>
    </div>
  {/each}
</div>
