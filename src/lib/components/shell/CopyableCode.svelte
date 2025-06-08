<script>
	import { Check, Copy } from "@lucide/svelte";

	export let value;

	let copied = false;

	async function handleClick() {
		await navigator.clipboard.writeText(value);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<div class="relative flex w-full items-center gap-4">
	<pre
		class="w-full shiki shiki-themes gruvbox github-light-high-contrast"
		style="--shiki-dark:#dfbf8e;--shiki-light:#0e1116;--shiki-dark-bg:hsl(var(--gruvdbg0));--shiki-light-bg:hsl(var(--gruvlbg0s))">
		<code class="px-3">{value}</code>
	</pre>
	<button
		class={"absolute right-4 rounded p-1.5 transition-colors " +
			(!copied ? "hover:bg-gruvwhite/10" : "hover:bg-gruvgreen/10")}
		on:click={handleClick}
	>
		{#if copied}
			<Check
				size="16"
				strokeWidth="5"
				class="text-gruvlemphgreen dark:text-gruvdemphgreen"
			/>
		{:else}
			<Copy size="16" />
		{/if}
	</button>
</div>
