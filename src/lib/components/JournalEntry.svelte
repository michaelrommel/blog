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
	class="m-1 flex flex-col min-w-[30ch] md:max-w-[60ch] md:min-w-[60ch] lg:max-w-[75ch] lg:min-w-[75ch]"
>
	<div
		class="p-2 min-h-max lg:h-auto leading-normal bg-gruvlbg dark:bg-gruvdbg border-gruvlfg4 dark:border-gruvdfg4 border rounded-sm"
	>
		<p class="text-xs text-gruvlfg3 dark:text-gruvgray xs:text-sm">
			{cardDate}
		</p>
		<p
			class="text-gruvlemphblue dark:text-gruvblue font-semibold text-sm xs:text-base md:text-xl mb-1"
		>
			{cardData.structuredData?.headline
				? cardData.structuredData?.headline
				: cardData.title}
		</p>
		<p
			class="text-xs text-gruvlemphpurple dark:text-gruvdemphpurple flex flex-wrap items-center"
		>
			{#each cardData.tags as tag (tag)}
				{#if tag === "new"}
					<span
						class="inline-flex mb-1 mr-2 items-center bg-gruvlemphgreen dark:bg-gruvdemphgreen rounded-full px-3 py-0 font-semibold text-gruvdfg dark:text-gruvlfg"
					>
						{tag}
					</span>
				{:else if tag === "private"}
					<span
						class="inline-flex mb-1 mr-2 items-center bg-gruvlemphred dark:bg-gruvlemphred rounded-full px-3 py-0 font-semibold text-gruvdfg dark:text-gruvdfg"
					>
						<svg
							class="fill-current w-3 h-3 mr-1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							><path
								d="M12 16q2.55-2.3 3.275-3.238T16 10.9q0-.9-.65-1.55T13.8 8.7q-.525 0-1.013.212T12 9.5q-.3-.375-.775-.587T10.2 8.7q-.9 0-1.55.65T8 10.9q0 .475.125.875t.55.938t1.212 1.312T12 16m0 6q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 3.8-2.262 6.913T12 22"
							/>
						</svg>
						{tag}
					</span>
				{:else}
					<span
						class="inline-flex mb-1 mr-2 items-center border border-gruvlemphpurple dark:border-gruvpurple rounded-full px-2 py-0 font-semibold"
					>
						{#if tag === "locked"}
							<svg
								class="fill-current w-3 h-3 mr-1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
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
