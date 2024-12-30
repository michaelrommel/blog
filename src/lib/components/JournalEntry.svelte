<script>
	import { formatRelative } from "date-fns";
	import { enGB } from "date-fns/locale";

	const formatRelativeLocale = {
		lastWeek: "'last' eeee 'at' HH:mm",
		yesterday: "'yesterday at' HH:mm",
		today: "'today at' HH:mm",
		tomorrow: "'tomorrow at' HH:mm",
		nextWeek: "eeee 'at' HH:mm",
		other: "yyyy-MM-dd HH:mm",
	};

	const locale = {
		...enGB,
		formatRelative: (token) => formatRelativeLocale[token],
	};

	let { cardData } = $props();
	let cardDate = $derived(
		formatRelative(
			new Date(
				cardData.structuredData?.dateModified
					? cardData.structuredData?.dateModified
					: cardData.structuredData?.dateCreated
						? cardData.structuredData?.dateCreated
						: cardData.structuredData?.datePublished
							? cardData.structuredData?.datePublished
							: "2022-01-01T00:00:00+01:00",
			),
			Date.now(),
			{ locale },
		),
	);
</script>

<div
	class="m-1 flex flex-col max-w-[40ch] min-w-[40ch] md:max-w-[60ch] md:min-w-[60ch] lg:max-w-[75ch] lg:min-w-[75ch]"
>
	<div
		class="px-2 min-h-max lg:h-auto leading-normal bg-gruvlbg dark:bg-gruvdbg border-gruvlfg dark:border-gruvdfg border rounded"
	>
		<p class="text-xs text-gruvlfg3 dark:text-gruvgray xs:text-sm">
			{cardDate}
		</p>
		<p
			class="text-gruvlemphblue dark:text-gruvblue font-bold text-sm xs:text-base md:text-xl mb-1"
		>
			{cardData.structuredData?.headline
				? cardData.structuredData?.headline
				: cardData.title}
		</p>
		<p
			class="text-xs text-gruvlemphpurple dark:text-gruvdemphpurple flex flex-wrap items-center"
		>
			{#each cardData.tags as tag}
				{#if tag === "new"}
					<span
						class="inline-flex mb-1 mr-2 items-center bg-gruvlemphgreen dark:bg-gruvdemphgreen rounded-full px-3 py-0 font-semibold text-gruvdfg dark:text-gruvlfg"
					>
						{tag}
					</span>
				{:else}
					<span
						class="inline-flex mb-1 mr-2 items-center border border-gruvlemphpurple dark:border-gruvpurple rounded-full px-3 py-0 font-semibold"
					>
						{#if tag === "locked"}
							<svg
								class="fill-current w-3 h-3 mr-1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path
									d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"
								/>
							</svg>
						{/if}
						{tag}
					</span>
				{/if}
			{/each}
		</p>
	</div>
</div>
