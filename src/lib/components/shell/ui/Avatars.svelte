<script>
	import { fade } from "svelte/transition";

	import { nameToHue } from "./LiveCursor.svelte";

	let { users } = $props();

	function nameToInitials(name) {
		const parts = name.split(/\s/).filter((s) => s);
		if (parts.length === 0) {
			return "-";
		} else if (parts.length === 1) {
			return parts[0][0].toLocaleUpperCase();
		} else {
			return (parts[0][0] + parts[1][0]).toLocaleUpperCase();
		}
	}
</script>

<div class="flex flex-row-reverse">
	{#each users as [id, user] (id)}
		<div
			class="avatar"
			style:background="hsla({nameToHue(user.name)}, 80%, 30%, 90%)"
			transition:fade|local={{ duration: 200 }}
		>
			{nameToInitials(user.name)}
		</div>
	{/each}
</div>
