<script>
	import "../../app.css";
	import JournalEntry from "$lib/components/JournalEntry.svelte";
	let { data } = $props();

	function segment(data) {
		const entries = {};
		for (const entry of data) {
			entries[entry.articleYear] = entries[entry.articleYear] ?? [];
			entries[entry.articleYear].push(entry);
		}
		return entries;
	}

	let segmentedData = $derived(segment(data.cards));

	function reverse(a, b) {
		if (a < b) {
			return 1;
		} else if (a > b) {
			return -1;
		} else {
			return 0;
		}
	}
</script>

<!-- <div class="col-span-12 md:mx-auto"> -->
<div class="col-span-12">
	{#each Object.keys(segmentedData).sort(reverse) as year}
		<div class="flex flex-row py-3 mx-16">
			<div class="basis-5/12 flex-grow content-center">
				<hr class="border-gruvblue" />
			</div>
			<div class="px-6 text-gruvpurple dark:text-gruvyellow text-2xl">
				{year}
			</div>
			<div class="basis-5/12 flex-grow content-center">
				<hr class="border-gruvblue" />
			</div>
		</div>
		<div class="flex flex-wrap justify-center items-center">
			{#each segmentedData[year] as cardData}
				<div class="m-1 p-1">
					<a
						class="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded"
						href="/journal/{cardData.articleYear}/{cardData.slug}"
					>
						<JournalEntry {cardData} />
					</a>
				</div>
			{:else}
				<div class="m-1 p-1">
					There are no journal entries that match your selection
					criteria.
				</div>
			{/each}
		</div>
	{:else}
		<div class="m-1 p-1 text-center">
			There are no journal entries that match your selection criteria.
		</div>
	{/each}
</div>
