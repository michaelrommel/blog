<script>
	import { getContext } from "svelte";
	import { preProcessMarkDown, processTree } from "$lib/markdown.js";
	import StackedBarChart from "$lib/components/StackedBarChart.svelte";
	import BarChart from "$lib/components/BarChart.svelte";
	import PieChart from "$lib/components/PieChart.svelte";
	import LineChart from "$lib/components/LineChart.svelte";
	import BubbleChart from "$lib/components/BubbleChart.svelte";
	import StlViewer from "$lib/components/StlViewer.svelte";

	import { visit } from "unist-util-visit";

	let { data } = $props();

	// this pulls the heights of the navigation bar and the footer
	// from the context set in +layout.svelte
	const margins = getContext("margins");

	// the ordered list of heading ids
	let idList = new Map();

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

	async function generateH2IdList(tree) {
		// this generates a map with the ids in the order they
		// appear on the page
		visit(tree, { tagName: "a" }, function (node) {
			const id = node.properties.href.slice(1);
			idList.set(id, {
				state: null,
				classes: null,
			});
		});
	}

	async function injectComponents(data) {
		const trees = await preProcessMarkDown(data.markdown);
		// console.log(trees);
		const fragments = [];
		// get fragments of the main tree that were split it at svelte component into
		// separate trees
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
		// get the table of contents tree
		for (const tree of trees.nav) {
			const frag = {
				position: "nav",
				type: "html",
			};
			frag.html = await processTree(tree);
			fragments.push(frag);
			// also walk the tree and excerpt the heading ids
			await generateH2IdList(tree);
		}
		// console.log(fragments);
		return fragments;
	}

	function ioCallback(entries) {
		// sort by time
		entries.sort((a, b) => {
			if (a.time < b.time) {
				return -1;
			} else if (a.time > b.time) {
				return 1;
			} else {
				return 0;
			}
		});
		// iterate over all intersection events to get a complete picture, where
		// we are at right now. The entries are all h2 elements when the Intersection
		// observer is instantiated, but usually only one element at a time, when the page scrolls
		entries.forEach((entry) => {
			const el = idList.get(entry.target.id);
			if (entry.isIntersecting) {
				el.state = "visible";
			} else if (
				entry.boundingClientRect.bottom > entry.rootBounds.bottom
			) {
				// scrolling upwards, entry scrolled out the bottom
				// need to set the previous toc entry to reading
				el.state = "below";
			} else if (entry.boundingClientRect.top < entry.rootBounds.top) {
				// scrolling downwards, entry scrolled out the top
				// keep this entry as reading
				el.state = "above";
			}
			idList.set(entry.target.id, el);
		});
		// now detect the currently visible entries
		let lastvisible = null;
		idList.forEach((el, id) => {
			if (el.state === "above") {
				// these are entries scrolled by
				el.classes.add("past");
				el.classes.delete("reading");
				// remember last visible heading
				lastvisible = id;
			} else if (el.state === "visible") {
				// these are entries currently visible
				el.classes.delete("past");
				el.classes.add("reading");
				// reset this, as we have a visible heading now
				lastvisible = null;
			} else if (el.state === "below" || el.state === null) {
				// these are entries scrolled by
				el.classes.delete("past");
				el.classes.delete("reading");
			}
			// now set the classes on this DOM element
			document.querySelector(`#toc-${id}`).className = Array.from(
				el.classes,
			).join(" ");
		});
		if (lastvisible) {
			const el = idList.get(lastvisible);
			el.classes.add("reading");
			document.querySelector(`#toc-${lastvisible}`).className =
				Array.from(el.classes).join(" ");
		}
	}

	const createIntersectionObserver = () => {
		$effect(() => {
			// get the current values of the element heights
			// note that on resize, the component is again instantiated
			// and this function runs
			const m = margins.get();
			// console.log(`createIntersectionObserver: ${m}`);
			const ioOpts = {
				threshold: 1.0,
				rootMargin: `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`,
			};

			const observer = new IntersectionObserver(ioCallback, ioOpts);

			// now add each h2 element to be observed
			idList.forEach((el, id) => {
				observer.observe(document.querySelector(`#${id}`));
				el.classes = new Set(
					document.querySelector(`#toc-${id}`).className.split(" "),
				);
				// update the entry
				idList.set(id, el);
			});
			// this is a sveltekit specific thing
			return () => {
				// console.log("removing IObserver");
				observer.disconnect();
			};
		});
	};
</script>

{#await injectComponents(data) then fragments}
	<main
		use:createIntersectionObserver
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
