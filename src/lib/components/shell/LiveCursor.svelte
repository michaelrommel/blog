<script module>
	/** Convert a string into a unique, hashed hue from 0 to 360. */
	export function nameToHue(name) {
		// Hashes the string with FNV.
		let hash = 2166136261;
		for (let i = 0; i < name.length; i++) {
			hash = (hash ^ name.charCodeAt(i)) * 16777619;
		}
		hash = (hash * 16777619) ^ -1;
		return 360 * (hash / (1 << 31));
	}
</script>

<script>
	import { fade } from "svelte/transition";

	let { user, showName = false } = $props();

	let hovering = $state(false);
	let lastMove = $state(Date.now());
	let time = $state(Date.now());
	let lastCursor = null;

	let fadeTime = 3000;

	$effect(() => {
		if (
			!lastCursor ||
			(user.cursor &&
				(lastCursor[0] !== user.cursor[0] ||
					lastCursor[1] != user.cursor[1]))
		) {
			lastCursor = user.cursor;
			lastMove = Date.now();
			setTimeout(() => {
				time = Date.now();
			}, fadeTime);
		}
	});
</script>

<div
	class="flex items-start"
	onmouseenter={() => (hovering = true)}
	onmouseleave={() => (hovering = false)}
	role="none"
>
	<svg width="23" height="23" viewBox="0 0 23 23">
		<path
			d="M11 22L2 2L22 11L14 14Z"
			fill="hsl({nameToHue(user.name)}, 100%, 50%)"
			stroke="#a89984"
		/>
	</svg>
	{#if showName || hovering || time - lastMove < fadeTime}
		<p
			class="mt-4 bg-zinc-700 text-xs px-1.5 py-[1px] rounded-full font-medium"
			transition:fade|local={{ duration: 150 }}
		>
			{user.name}
		</p>
	{/if}
</div>
