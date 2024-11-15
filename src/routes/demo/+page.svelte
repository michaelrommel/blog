<script>
	import "../../app.css";
	import MarkdownCharts from "$lib/components/MarkdownComponent.svelte";
	export let data;
</script>

<div id="articlecontainer" class="col-span-12 md:mx-auto">
	<div
		class="mdsvx prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
	>
		<MarkdownCharts {data} />
	</div>
</div>
