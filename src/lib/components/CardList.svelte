<script>
	import "../../app.css";
	import Card from "$lib/components/Card.svelte";
	let { data } = $props();
</script>

<!-- <div class="col-span-12 md:mx-auto"> -->
<div class="col-span-12">
	<div class="flex flex-col">
		{#each data.cards as cardData}
			<div class="self-center m-1 p-1">
				<a
					class="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-sm"
					href="/{cardData.articleCategory}/{cardData.slug}"
				>
					<Card {cardData} />
				</a>
			</div>
		{/each}
	</div>
</div>
