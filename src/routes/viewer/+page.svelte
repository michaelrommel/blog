<script>
	/** @type {import('./$types').PageData} */
	import "../../app.css";
	import StlViewer from "$lib/components/StlViewer.svelte";
	let { data } = $props();
</script>

<div class="col-span-12">
	<StlViewer file={data.file} dpr={data.dpr} inertia={data.inertia} />
</div>
