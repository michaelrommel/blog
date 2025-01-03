<script>
	import { preProcessMarkDown, processTree } from "$lib/markdown.js";
	import StackedBarChart from "$lib/components/StackedBarChart.svelte";
	import BarChart from "$lib/components/BarChart.svelte";
	import PieChart from "$lib/components/PieChart.svelte";
	import LineChart from "$lib/components/LineChart.svelte";
	import BubbleChart from "$lib/components/BubbleChart.svelte";
	import StlViewer from "$lib/components/StlViewer.svelte";

	let { data } = $props();

	// const componentRegex = RegExp(
	// 	"(<sveltecomponent.*?></sveltecomponent>)",
	// 	"g",
	// );
	// const propsRegex = RegExp("<sveltecomponent(.*?)></sveltecomponent>", "g");
	// // componentname="StackedBarChart" stackedData="data.perCountry" xSelector="day"
	// const valueRegex = RegExp(
	// 	"(?<propname>[^ ]+?) ?= ?(?<propvalue>[^ ]+?)(?: |$)",
	// 	"g",
	// );

	const components = {
		StackedBarChart: StackedBarChart,
		BarChart: BarChart,
		PieChart: PieChart,
		LineChart: LineChart,
		BubbleChart: BubbleChart,
		StlViewer: StlViewer,
	};

	function processSvelteComponent(tree) {
		// define a svelte component
		const sc = {
			componentname: null,
			data: null,
			props: {},
		};
		// extract the properties string
		for (const k of Object.keys(tree.properties)) {
			const val = tree.properties[k].replaceAll('"', "");
			switch (k) {
				case "componentname": {
					// this is the component to instantiate
					sc["componentname"] = val;
					break;
				}
				case "data": {
					// the data portion
					sc["data"] = val;
					break;
				}
				default: {
					sc["props"][k] = val;
				}
			}
		}
		return sc;
	}

	async function injectComponents(data) {
		const trees = await preProcessMarkDown(data.markdown);
		// console.log(trees);
		const fragments = [];
		for (const tree of trees.main) {
			const frag = {
				position: "main",
			};
			if (tree.type === "svelte") {
				frag.type = "svelte";
				frag.object = processSvelteComponent(tree);
			} else {
				frag.type = "html";
				frag.html = await processTree(tree);
			}
			fragments.push(frag);
		}
		for (const tree of trees.nav) {
			const frag = {
				position: "nav",
				type: "html",
			};
			frag.html = await processTree(tree);
			fragments.push(frag);
		}
		// console.log(fragments);
		return fragments;
	}
</script>

{#await injectComponents(data) then fragments}
	<main
		class="markdown prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
	>
		{#each fragments as part}
			{@const main = part.position === "main"}
			{#if main}
				{@const sv = part.type === "svelte"}
				{#if sv}
					{@const Thing = components[part.object.componentname]}
					{#if part.object.data}
						<Thing
							data={data.chartdata[part.object.data]}
							{...part.object.props}
						/>
					{:else}
						<Thing
							data={data.chartdata[part.object.data]}
							{...part.object.props}
						/>
					{/if}
				{:else}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html part.html}
				{/if}
			{/if}
		{/each}
	</main>
	{#each fragments as part}
		{@const nav = part.position === "nav"}
		{#if nav}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html part.html}
		{/if}
	{/each}
{/await}
