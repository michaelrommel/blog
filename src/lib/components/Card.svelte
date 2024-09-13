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

	export let cardData;
	const creationDate = new Date(cardData.creationDate);
	cardData.displayDate = formatRelative(creationDate, new Date(), { locale });
</script>

<div class="m-1 flex flex-col lg:flex-row max-w-[40ch] lg:max-w-prose">
	<div
		class="min-h-max lg:h-auto lg:w-64 flex bg-gruvlbg dark:bg-gruvdbg lg:flex-col justify-center border-l border-t border-r lg:border-r-0 border-gruvlfg dark:border-gruvdfg lg:border-b rounded-t lg:rounded-t-none lg:rounded-l"
	>
		<div
			class="mx-4 w-40 h-40 xs:w-52 xs:h-52 flex-none bg-contain bg-no-repeat bg-center text-center overflow-hidden"
			style="background-image: url({cardData.thumbnailUrl});"
			title={cardData.thumbnailTitle}
		/>
	</div>
	<div
		class="border-r border-b border-l border-gruvlfg dark:border-gruvdfg lg:border-l-0 lg:border-t bg-gruvlbg dark:bg-gruvdbg rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal"
	>
		<div class="mb-3">
			<div
				class="text-gruvlemphblue dark:text-gruvblue font-bold text-sm xs:text-base md:text-xl mb-2"
			>
				{cardData.title}
			</div>
			<p
				class="text-gruvlfg dark:text-gruvdfg text-xs xs:text-sm md:text-base mb-2"
			>
				{cardData.description}
			</p>
			<div
				class="text-xs text-gruvlpurple dark:text-gruvpurple flex flex-wrap items-center"
			>
				{#each cardData.tags as tag}
					{#if tag === "new"}
						<span
							class="inline-flex mb-2 mr-2 items-center bg-gruvlemphgreen dark:bg-gruvdemphgreen rounded-full px-3 py-0 font-semibold text-gruvdfg dark:text-gruvlfg"
						>
							{tag}
						</span>
					{:else}
						<span
							class="inline-flex mb-2 mr-2 items-center border border-gruvlemphpurple dark:border-gruvlemphpurple rounded-full px-3 py-0 font-semibold text-gruvlemphpurple dark:gruvpurple"
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
			</div>
		</div>
		<div class="flex items-center">
			<img
				class="w-15 h-15 rounded-full mr-4"
				src={cardData.authorAvatarUrl}
				alt="Avatar of {cardData.authorName}"
			/>
			<div class="mt-1 text-xs">
				<p
					class="mb-0 font-bold text-gruvlfg2 dark:text-gruvgray leading-none"
				>
					{cardData.authorName}
				</p>
				<p class="mb-0 text-gruvlfg3 dark:text-gruvgray">
					{cardData.displayDate}
				</p>
			</div>
		</div>
	</div>
</div>
