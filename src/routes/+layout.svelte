<script>
	import "../app.css";
	import { page } from "$app/stores";
	import { ModeWatcher } from "mode-watcher";
	import Navigation from "$lib/components/Navigation.svelte";
	import SeoMarkup from "$lib/components/SeoMarkup.svelte";
	import Footer from "$lib/components/Footer.svelte";
	let { children } = $props();
</script>

<SeoMarkup
	url={$page.url}
	data={{
		title: $page.data.title,
		description: $page.data.description,
		structuredData: $page.data.structuredData,
	}}
/>

<ModeWatcher />
<Navigation />

<div class="overflow-auto m-3">
	<div class="grid grid-cols-12 gap-4">
		{@render children?.()}
	</div>
</div>

<Footer />
