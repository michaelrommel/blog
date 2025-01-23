<script>
	import "../app.css";
	import { onMount, setContext } from "svelte";
	import { page } from "$app/stores";
	import { ModeWatcher } from "mode-watcher";
	import Navigation from "$lib/components/Navigation.svelte";
	import SeoMarkup from "$lib/components/SeoMarkup.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { debounce } from "$lib/util.js";
	let { data, children } = $props();

	let margins = $state([0, 0, 0, 0]);
	setContext("margins", {
		get: () => margins,
	});

	let navigationElement = null;
	let footerElement = null;

	function onResize(args) {
		for (const entry of args) {
			if (entry.target.clientHeight === 0) {
				// not fully mounted or destroyed, skip
				continue;
			}
			// approximate the margin set on the h2 elements
			margins[0] = -navigationElement.clientHeight + 27;
			margins[2] = -footerElement.clientHeight + 9;
		}
	}

	const processResize = debounce((args) => onResize(args));

	onMount(() => {
		const rsObserver = new ResizeObserver(processResize);
		rsObserver.observe(navigationElement);
	});

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
<wrapper bind:this={navigationElement} class="sticky top-0 z-10 w-full block">
	<Navigation data={{ user: data.user }} />
</wrapper>

<div class="m-3">
	<div class="">
		{@render children?.()}
	</div>
</div>

<wrapper bind:this={footerElement} class="w-full block">
	<Footer />
</wrapper>
