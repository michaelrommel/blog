<script>
	import { nameToHue } from "./LiveCursor.svelte";

	let { users } = $props();
	let sortedUsers = $derived(
		[...users].sort((a, b) => (b[1].name < a[1].name ? 1 : -1)),
	);
	// $effect(() => {
	// 	console.log($state.snapshot(sortedUsers));
	// });
</script>

<div class="flex items-center p-1 bg-gruvdbg0/50 rounded-t-md">
	<div class="ml-2 text-zinc-300 text-sm font-medium">Buddies</div>
</div>

<div class="p-1 flex-grow rounded-b-md overflow-y-auto bg-gruvdbg1">
	<div class="rounded-b-md text-xs">
		<ul class="flex flex-col">
			{#each sortedUsers as [id, user] (id)}
				<li
					class="flex p-1 gap-2 items-center"
					class:opacity-75={!user.canWrite}
				>
					<div
						style:background="hsl({nameToHue(user.name)}, 100%, 50%)"
						class="w-3.5 h-3.5 rounded-full border border-[#a89984]"
					></div>

					<div>
						{user.name}
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
