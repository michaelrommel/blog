<script context="module">
  export async function load({ fetch }) {
    const cardDataList = [
      {
        thumbnailUrl: '/ourvinyl-morgan-wade-1.jpg',
        thumbnailTitle: 'Photo of Morgan Wade sitting on a bar stool holding a guitar',
        title: 'Morgan Wade',
        description: 'Last fall I discovered Morgan Wade. Here I share my favourite tracks and a link to a good, raw performance. There is also a link to a Spotify playlist I made.',
        creationDate: new Date('2022-01-16T23:21:13+01:00'),
        authorName: 'Michael Rommel',
        authorAvatarUrl: 'https://avatars.githubusercontent.com/u/919935?s=40&v=4',
        tags: ['new', 'locked', 'consume', 'music', 'country', 'female', 'songwriter']
      }
    ];
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

<div class="flex justify-center">
{#each cardDataList as cardData}
  <a href="/consume/2022-01-16-morgan-wade/"><Card cardData={cardData}/></a>
{/each}
</div>
