<script>
	import { parseMarkdown } from "$lib/markdown.js";
	export let data;
	export let markdown = data.markdown;
</script>

{#await parseMarkdown(markdown) then result}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html result}
{/await}
