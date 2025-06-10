<script>
	import "../app.css";

	import { onMount, setContext } from "svelte";
	import { page } from "$app/state";

	import { debounce } from "$lib/utils.js";

	import { ModeWatcher } from "mode-watcher";
	import { Check, X, Info, TriangleAlert } from "@lucide/svelte";

	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import Navigation from "$lib/components/Navigation.svelte";
	import SeoMarkup from "$lib/components/SeoMarkup.svelte";
	import Footer from "$lib/components/Footer.svelte";

	let { data, children } = $props();

	let margins = $state([0, 0, 0, 0]);
	setContext("margins", {
		get: () => margins,
	});

	let overrideTitle = $state(null);
	setContext("overrideTitle", (newTitle) => {
		overrideTitle = newTitle;
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
	// console.log(`in layout.svelte page is: ${JSON.stringify(page, null, 4)}`);
</script>

<SeoMarkup
	url={page.url}
	data={{
		title: overrideTitle ?? page.data.title,
		description: page.data.description,
		structuredData: page.data.structuredData,
	}}
/>

<ModeWatcher />

<Toaster
	position="bottom-right"
	visibleToasts={5}
	expand
	closeButton
	duration={10000}
	toastOptions={{
		// style: "background-color: hsl(var(--gruvdbg1));",
		unstyled: true,
		classes: {
			toast: "p-2 rounded-xl bg-gruvlbg1 dark:bg-gruvdbg1 border border-gruvgray flex items-center",
			title: "font-serif m-2 pl-1 pr-5 text-sm dark:text-gruvdfg",
			closeButton: "absolute top-2 right-2",
			description: "text-red-400",
			actionButton: "bg-zinc-400",
			cancelButton: "bg-orange-400",
		},
	}}
>
	{#snippet successIcon()}
		<Check
			class="m-2 p-1 bg-gruvlemphgreen text-gruvlbg dark:bg-gruvdemphgreen dark:text-gruvdbg rounded-full"
			size="30"
		/>
	{/snippet}
	{#snippet errorIcon()}
		<X
			class="m-2 p-1 bg-gruvlemphred text-gruvlbg dark:bg-gruvdemphred rounded-full"
			size="30"
		/>
	{/snippet}
	{#snippet infoIcon()}
		<Info
			class="m-2 p-1 bg-gruvlemphblue text-gruvlbg dark:bg-gruvblue dark:text-gruvdbg rounded-full"
			size="30"
		/>
	{/snippet}
	{#snippet warningIcon()}
		<TriangleAlert
			class="m-2 p-1 bg-gruvlemphyellow text-gruvlbg dark:bg-gruvyellow dark:text-gruvdbg rounded-full"
			size="30"
		/>
	{/snippet}
</Toaster>

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
