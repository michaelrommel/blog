<script>
	import { parseMarkdown } from "$lib/markdown.js";
	import StackedBarChart from "$lib/components/StackedBarChart.svelte";
	import BarChart from "$lib/components/BarChart.svelte";
	import PieChart from "$lib/components/PieChart.svelte";

	export let data;

	const componentRegex = RegExp(
		"(<SvelteComponent.*?></SvelteComponent>)",
		"g",
	);
	const propsRegex = RegExp("<SvelteComponent(.*?)></SvelteComponent>", "g");
	// componentname="StackedBarChart" stackedData="data.perCountry" xSelector="day"
	const valueRegex = RegExp(
		"(?<propname>[^ ]+?) ?= ?(?<propvalue>[^ ]+?)(?: |$)",
		"g",
	);

	export let components = {
		StackedBarChart: StackedBarChart,
		BarChart: BarChart,
		PieChart: PieChart,
	};

	function searchComponents(html) {
		const parts = html.split(componentRegex);
		// console.log(parts);
		const rewrite = parts.map((p) => {
			if (componentRegex.test(p)) {
				// define a svelte component
				const sc = {
					componentname: null,
					data: null,
					props: {},
				};
				// extract the properties string
				const pmatches = p.matchAll(propsRegex);
				for (const match of pmatches) {
					// we should get a match here
					const prop = match[1];
					// search now for key/value pairs
					const vmatches = prop.matchAll(valueRegex);
					for (const vmatch of vmatches) {
						const val = vmatch.groups.propvalue.replaceAll('"', "");
						switch (vmatch.groups.propname) {
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
								sc["props"][vmatch.groups.propname] = val;
							}
						}
					}
				}
				return sc;
			} else {
				return p;
			}
		});
		return rewrite;
	}

	async function injectComponents(data) {
		const html = await parseMarkdown(data.markdown);
		const fragments = searchComponents(html);
		// console.log(`after search ${JSON.stringify(fragments, null, 2)}`);
		// console.log(`data: ${data.chartdata.inline[0]}`);
		return fragments;
	}
</script>

{#await injectComponents(data) then splitted}
	{#each splitted as part}
		{@const match = typeof part === "object"}
		{#if match}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<svelte:component
				this={components[part.componentname]}
				data={data.chartdata[part.data]}
				{...part.props}
			></svelte:component>
		{:else}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html part}
		{/if}
	{/each}
{/await}
