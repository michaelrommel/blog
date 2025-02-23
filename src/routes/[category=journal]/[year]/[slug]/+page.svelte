<script>
	import "../../../../app.css";
	import Markdown from "$lib/components/MarkdownComponent.svelte";
	let { data } = $props();
</script>

<article id="articlecontainer" class="">
	<div id="centerwrapper" class="flex flex-col">
		<article id="article" class="flex justify-center">
			<Markdown {data} />
		</article>
		<div id="flourish" class="flex flex-row py-3 mx-auto">
			<div class="basis-5/12 grow content-center">
				<hr class="border-gruvblue" />
			</div>
			<div
				class="px-6 content-center text-gruvpurple dark:text-gruvyellow"
			>
				~~~
			</div>
			<div class="basis-5/12 grow content-center">
				<hr class="border-gruvblue" />
			</div>
		</div>
	</div>
</article>
