<script>
	/** @type {import('./$types').PageData} */
	import "../app.css";
	import Card from "$lib/components/Card.svelte";
	export let data;
</script>

<div class="flex flex-col">
	{#each data.cards as cardData}
		<div class="self-center">
			<a href="/{cardData.articleCategory}/{cardData.slug}">
				<Card {cardData} />
			</a>
		</div>
	{/each}
</div>
