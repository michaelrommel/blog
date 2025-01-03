<script>
	import "../app.css";
	import { page } from "$app/stores";
	import { ModeWatcher } from "mode-watcher";
	import Navigation from "$lib/components/Navigation.svelte";
	import SeoMarkup from "$lib/components/SeoMarkup.svelte";
	import Footer from "$lib/components/Footer.svelte";
	let { data, children } = $props();
	// console.log(`in layout.svelte data is: ${JSON.stringify(data, null, 4)}`);
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
<Navigation data={{ user: data.user }} />

<div class="m-3">
	<div class="">
		{@render children?.()}
	</div>
</div>

<Footer />
