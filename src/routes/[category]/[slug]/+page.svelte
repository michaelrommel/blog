<script>
	import "../../../app.css";
	import Markdown from "$lib/components/MarkdownComponent.svelte";
	export let data;
</script>

<div id="articlecontainer" class="col-span-12 md:mx-auto">
	<div
		class="mdsvx prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
	>
		<Markdown {data} />
	</div>
	<div class="flex flex-row py-3">
		<div class="basis-5/12 content-center">
			<hr class="border-gruvblue" />
		</div>
		<div class="px-8 text-gruvyellow">~ ~ ~</div>
		<div class="basis-5/12 content-center">
			<hr class="border-gruvblue" />
		</div>
	</div>
</div>
