<script>
	import { nameToHue } from "./LiveCursor.svelte";
	import { Eye } from "@lucide/svelte";

	let { users } = $props();
	let sortedUsers = $derived(
		[...users].sort((a, b) => (b[1].name < a[1].name ? 1 : -1)),
	);
	// $effect(() => {
	// 	console.log($state.snapshot(sortedUsers));
	// });
</script>

<div
	class="flex items-center p-1 bg-gruvlbg1/90 dark:bg-gruvdbg1/90 rounded-t-md"
>
	<div class="ml-2 text-gruvlfg dark:text-gruvdfg text-sm font-medium">
		Buddies
	</div>
</div>

<div
	class="p-1 flex-grow rounded-b-md overflow-y-auto bg-gruvlbg0 dark:bg-gruvdbg0"
>
	<div class="rounded-b-md text-xs">
		<ul class="flex flex-col">
			{#each sortedUsers as [id, user] (id)}
				<li
					class="flex p-1 gap-2 items-center overflow-hidden"
					class:opacity-50={!user.canWrite}
				>
					<div
						style:background="hsl({nameToHue(user.name)}, 100%, 50%)"
						class="shrink-0 w-3.5 h-3.5 rounded-full border border-gruvlfg3"
					></div>

					<div
						class="overflow-hidden max-w-24 dark:text-gruvdfg text-gruvlfg"
					>
						{user.name}
					</div>
					<div class="shrink-0 w-3.5">
						{#if !user.canWrite}
							<Eye size="18px" class="text-gruvdfg" />
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
