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

	let h2IdList = [];
	let tocIdList = [];

	function populateClasses(id) {
		for (const element of tocIdList) {
			if (element.id === id) {
				element.classes = new Set(
					document.querySelector(`#toc-${id}`).className.split(" "),
				);
				break;
			}
		}
	}

	function addClass(id, cl) {
		for (const element of tocIdList) {
			if (element.id === id) {
				element.classes.add(cl);
				break;
			}
		}
	}

	function delClass(id, cl) {
		for (const element of tocIdList) {
			if (element.id === id) {
				element.classes.delete(cl);
				break;
			}
		}
	}

	function setState(id, state) {
		for (const element of tocIdList) {
			if (element.id === id) {
				element.state = state;
				break;
			}
		}
	}

	async function generateH2IdList(tree) {
		visit(tree, { tagName: "a" }, function (node) {
			h2IdList.push(node.properties.href.slice(1));
			tocIdList.push({
				id: node.properties.href.slice(1),
				state: null,
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
		// we are at right now
		entries.forEach((entry) => {
			console.log(entry);
			if (entry.isIntersecting) {
				setState(entry.target.id, "visible");
			} else if (
				entry.boundingClientRect.bottom > entry.rootBounds.bottom
			) {
				// scrolling upwards, entry scrolled out the bottom
				// need to set the previous toc entry to reading
				setState(entry.target.id, "below");
			} else if (entry.boundingClientRect.top < entry.rootBounds.top) {
				// scrolling downwards, entry scrolled out the top
				// keep this entry as reading
				setState(entry.target.id, "above");
			}
		});
		// now detect the currently visible entries
		let last = null;
		for (let i = 0; i < tocIdList.length; i++) {
			if (tocIdList[i].state === "above") {
				// these are entries visible
				addClass(tocIdList[i].id, "past");
				delClass(tocIdList[i].id, "reading");
				// remember last one
				last = i;
				console.log(`last = ${i}`);
			} else if (tocIdList[i].state === "visible") {
				// these are entries scrolled by
				addClass(tocIdList[i].id, "reading");
				delClass(tocIdList[i].id, "past");
				last = null;
				console.log("resetting last to null");
			} else if (
				tocIdList[i].state === "below" ||
				tocIdList[i].state === null
			) {
				// these are entries scrolled by
				delClass(tocIdList[i].id, "past");
				delClass(tocIdList[i].id, "reading");
			}
			document.querySelector(`#toc-${tocIdList[i].id}`).className =
				Array.from(tocIdList[i].classes).join(" ");
		}
		if (last) {
			console.log(`adding reading to above ${last}`);
			addClass(tocIdList[last].id, "reading");
			document.querySelector(`#toc-${tocIdList[last].id}`).className =
				Array.from(tocIdList[last].classes).join(" ");
		}

		console.log(tocIdList);
	}

	const margins = getContext("margins");

	const createIntersectionObserver = () => {
		$effect(() => {
			const m = margins.get();
			// console.log(`createIntersectionObserver: ${m}`);
			const ioOpts = {
				threshold: 1.0,
				rootMargin: `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`,
			};

			const observer = new IntersectionObserver(ioCallback, ioOpts);

			for (const h2id of h2IdList) {
				console.log(h2id);
				observer.observe(document.querySelector(`#${h2id}`));
				populateClasses(h2id);
			}
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
