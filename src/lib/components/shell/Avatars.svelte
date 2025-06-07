<script>
	import { fade } from "svelte/transition";
	import { nameToHue } from "./LiveCursor.svelte";

	let { users } = $props();

	function nameToInitials(name) {
		const parts = name.split(/\s/).filter((s) => s);
		const initials = parts.map((p) => p[0].toLocaleUpperCase()).join("");
		return initials == "" ? "?" : initials;
	}
</script>

<div class="flex flex-row-reverse self-center mr-1">
	{#each users as [id, user] (id)}
		<div
			class="h-[20px] rounded-full text-[0.5rem] font-medium flex justify-center items-center p-1 mr-1 first:mr-0"
			style:background="hsla({nameToHue(user.name)}, 80%, 30%, 90%)"
			transition:fade|local={{ duration: 200 }}
		>
			{nameToInitials(user.name)}
		</div>
	{/each}
</div>
